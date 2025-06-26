
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  subcategory?: string;


  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';


  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop([String])
  tags: string[];

  @Prop({ type: Object })
  productDetails: any;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
