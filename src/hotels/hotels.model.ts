import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelsDocument = Hotels & Document;
@Schema({ timestamps: true })
export class Hotels {
  @Prop({ isRequired: true, type: String })
  name: string;
  @Prop({ isRequired: true, type: String })
  type: string;
  @Prop({ isRequired: true, type: String })
  country: string;
  @Prop({ isRequired: true, type: String })
  city: string;
  @Prop({ isRequired: true, type: String })
  address: string;
  @Prop({ isRequired: true, type: String })
  distance: string;
  @Prop({ type: () => [String] })
  photos: string[];
  @Prop({ isRequired: true, type: String })
  description: string;
  @Prop({ type: Number, min: 0, max: 5 })
  rating: number;
  @Prop({ type: () => [String] })
  rooms: string[];
  @Prop({ isRequired: true, type: Number })
  cheapestPrice: number;
  @Prop({ type: Boolean, default: false })
  featured: boolean;
}
export const HotelSchema = SchemaFactory.createForClass(Hotels);
