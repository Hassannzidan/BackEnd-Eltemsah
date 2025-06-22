// export class CreateProductDto {
//   name: string;
//   description: string;
//   category: string;
//   subcategory?: string;
//   status: 'active' | 'inactive';
//   images: string[];
//   tags: string[];
//   productDetails: any; 
// }


import { Type } from 'class-transformer';
import { 
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
 } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsObject()
  productDetails: any; // ممكن تعمل له interface لاحقًا
}

