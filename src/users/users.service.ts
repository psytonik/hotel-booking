import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from './users.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findAll() {
    return `This service return all users`;
  }
  async findOne(id: number) {
    return `This service return ${id}`;
  }
  async update(id: number) {
    return `This service update ${id}`;
  }
  async remove(id: number) {
    return `This service remove ${id}`;
  }
}
