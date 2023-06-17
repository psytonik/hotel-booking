import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from '../../users/users.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../hashing/hashing.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ActiveUserDataInterface } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './storage/refresh-token-ids.storage';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const newUser = new this.userModel({
        email: signUpDto.email,
        passwordHash: await this.hashingService.hash(signUpDto.passwordHash),
      });
      return await newUser.save();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userModel.findOne({ email: signInDto.email });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.passwordHash,
      user.passwordHash,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    return await this.generateTokens(user);
  }
  async generateTokens(user) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserDataInterface>>(
        user.id,
        this.jwtConfiguration.accessTokenTTL,
        { email: user.email, role: user.role },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTTL, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signToken<T>(
    userId: number,
    expiresIn: number,
    payload: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserDataInterface, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });
      const user = await this.userModel.findById(sub);
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.inValidate(user.id);
      } else {
        throw new Error('Refresh Token is Invalid');
      }
      return this.generateTokens(user);
    } catch (e) {
      if (e instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access Denied');
      }
      throw new UnauthorizedException(e.message);
    }
  }
}
