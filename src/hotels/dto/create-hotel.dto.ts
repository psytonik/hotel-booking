import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHotelDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  type: string;

  @ApiProperty({ required: true })
  @IsString()
  country: string;

  @ApiProperty({ required: true })
  @IsString()
  city: string;

  @ApiProperty({ required: true })
  @IsString()
  address: string;

  @ApiProperty({ required: true })
  @IsString()
  distance: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @ApiProperty({ required: true })
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  rooms: string[];

  @ApiProperty()
  @IsNumber()
  cheapestPrice: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  featured: boolean;
}
