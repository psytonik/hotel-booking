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

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async signInToken(signInDto: SignInDto): Promise<{ accessToken: string }> {
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
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTTL,
      },
    );
    return {
      accessToken,
    };
  }
  async signUpToken(signUpDto: SignUpDto) {
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
}
