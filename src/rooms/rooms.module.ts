import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rooms, RoomsSchema } from './rooms.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Rooms.name,
        schema: RoomsSchema,
        collection: 'Rooms',
      },
    ]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
