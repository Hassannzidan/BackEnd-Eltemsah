import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import path from 'path';
import fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return updated;
  }

  // async delete(id: string): Promise<void> {
  //   const product = await this.productModel.findById(id).exec();

  //   if (!product) {
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }

  //   // احذف الصور من السيرفر
  //   if (product.images && Array.isArray(product.images)) {
  //     for (const imageUrl of product.images) {
  //       const fileName = path.basename(imageUrl);
  //       const imagePath = path.join(__dirname, '..', '..', 'uploads', fileName);

  //       fs.unlink(imagePath, (err) => {
  //         if (err) {
  //           console.error('Error deleting image file:', err);
  //         } else {
  //           console.log('Deleted image:', fileName);
  //         }
  //       });
  //     }
  //   }

  //   const result = await this.productModel.deleteOne({ _id: id }).exec();
  //   if (result.deletedCount === 0) {
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }
  // }

  async delete(id: string): Promise<void> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // ✅ هنا ضيفي الـ console.log عشان تشوفي المشكلة
    console.log('🧾 product.images:', product.images);

    // ✅ احذري من قيم undefined أو null أو غير string
    // if (Array.isArray(product.images)) {
    //   for (const imageUrl of product.images) {
    //     if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
    //       try {
    //         const fileName = path.basename(imageUrl);
    //         const imagePath = path.join(
    //           __dirname,
    //           '..',
    //           '..',
    //           'uploads',
    //           fileName,
    //         );

    //         fs.unlink(imagePath, (err) => {
    //           if (err) {
    //             console.error('❌ Error deleting image file:', err);
    //           } else {
    //             console.log('✅ Deleted image:', fileName);
    //           }
    //         });
    //       } catch (error) {
    //         console.error('❌ Unexpected error during image deletion:', error);
    //       }
    //     } else {
    //       console.warn('⚠️ Skipped invalid imageUrl:', imageUrl);
    //     }
    //   }
    // }
    if (Array.isArray(product.images)) {
      for (const imageUrl of product.images) {
        // 🛡️ حماية قوية ضد undefined/null/فراغ
        if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
          try {
            const fileName = path.basename(new URL(imageUrl).pathname); // ✅ أهم نقطة: استخراج المسار من URL
            const imagePath = path.join(
              __dirname,
              '..',
              '..',
              'uploads',
              fileName,
            );

            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error('❌ Error deleting image file:', err);
              } else {
                console.log('✅ Deleted image:', fileName);
              }
            });
          } catch (error) {
            console.error('❌ Unexpected error during image deletion:', error);
          }
        } else {
          console.warn('⚠️ Skipped invalid imageUrl:', imageUrl);
        }
      }
    }

    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findById(id: string): Promise<any> {
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
