import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hotels } from './hotels.model';
import { Model } from 'mongoose';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotels.name) private readonly hotelsModel: Model<Hotels>,
  ) {}
  async create(createHotelDto: CreateHotelDto) {
    try {
      const newHotel = new this.hotelsModel({
        ...createHotelDto,
      });
      return await newHotel.save();
    } catch (err) {}
  }

  async findAll() {
    return this.hotelsModel.find();
  }

  async findOne(id: string) {
    try {
      return await this.hotelsModel.findById(id).exec();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  update(id: string, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }

  async remove(id: string) {
    return this.findOne(id);
  }
}
