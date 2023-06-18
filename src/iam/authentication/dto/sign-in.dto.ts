import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  readonly passwordHash: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  tfaCode?: string;
}
