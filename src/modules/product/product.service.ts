import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}


  // async create(createProductDto: CreateProductDto): Promise<Product> {
  // const newProduct = new this.productModel(createProductDto);
  // return newProduct.save();
  // }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

//   async update(id: string, product: Partial<Product>): Promise<Product | null> {
//   return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
// }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
  const updated = await this.productModel.findByIdAndUpdate(id, dto, {
    new: true,
  });

  if (!updated) {
    throw new NotFoundException(`Product ${id} not found`);
  }

  return updated;
}

  async delete(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

   async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
  
   async toggleStatus(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    product.status = product.status === 'active' ? 'inactive' : 'active';
    return product.save();
  }
}
