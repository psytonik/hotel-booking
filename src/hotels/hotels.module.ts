import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotels, HotelSchema } from './hotels.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Hotels.name,
        schema: HotelSchema,
        collection: 'Hotels',
      },
    ]),
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
