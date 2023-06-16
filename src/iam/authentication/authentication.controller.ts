import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUpUser(@Body() userDto: SignUpDto) {
    return this.authenticationService.signUpToken(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signInUser(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authenticationService.signInToken(signInDto);
  }
}
