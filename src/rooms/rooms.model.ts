import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomsDocument = Rooms & Document;
@Schema({ timestamps: true })
export class Rooms {
  @Prop()
  price: string;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
