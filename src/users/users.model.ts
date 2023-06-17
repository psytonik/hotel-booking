import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from './enums/roles.enum';

export type UserDocument = Users & Document;
@Schema({ timestamps: true })
export class Users {
  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;

  @Prop({ enum: Role, default: Role.Regular })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(Users);
