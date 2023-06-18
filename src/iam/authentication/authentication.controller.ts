import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { Auth } from './decorator/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserDataInterface } from '../interfaces/active-user-data.interface';
import { Response } from 'express';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';

@ApiTags('Authentication')
@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUpUser(@Body() userDto: SignUpDto) {
    return this.authenticationService.signUp(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signInUser(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authenticationService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(refreshTokenDto);
  }

  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() user: ActiveUserDataInterface,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      user.email,
    );
    await this.otpAuthService.enableTfaForUser(user.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
