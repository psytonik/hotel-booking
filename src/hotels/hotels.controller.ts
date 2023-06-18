import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorator/auth.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @Get()
  @Auth(AuthType.None)
  async findAll() {
    return await this.hotelsService.findAll();
  }

  @Get(':id')
  @Auth(AuthType.None)
  async findOne(@Param('id') id: string) {
    return await this.hotelsService.findOne(id);
  }

  @Patch(':id')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(id);
  }
}
