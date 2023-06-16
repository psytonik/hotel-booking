import { Controller, Get, HttpCode } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @HttpCode(200)
  @Get('/')
  async getRooms() {
    return 'rooms';
  }
}
