import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Express } from 'express';
import type { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  // @Post()
  // @UseInterceptors(
  //   FilesInterceptor('images', 10, {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
  //         cb(null, uniqueName);
  //       },
  //     }),
  //     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
  //   }),
  // )
  // async create(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() body: any,
  // ) {
  //   const imageUrls = files.map(
  //     (file) => `http://localhost:3000/uploads/${file.filename}`,
  //   );

  //   const productData = {
  //     ...body,
  //     images: imageUrls,
  //     tags:  body.tags ? JSON.parse(body.tags) : [],
  //     productDetails:body.productDetails ? JSON.parse(body.productDetails) : {},
  //   };

  //   return this.productService.create(productData);
  // }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ): Promise<{ message: string; product: Product }> {
    const imageUrls = files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`,
    );

    const productData: CreateProductDto = {
      ...body,
      images: imageUrls,
      tags: body.tags ? JSON.parse(body.tags) : [],
      productDetails: body.productDetails ? JSON.parse(body.productDetails) : {},
    };

    const createdProduct = await this.productService.create(productData);
    return {
      message: 'Product created successfully',
      product: createdProduct,
    };
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() product: Partial<Product>) {
  //   return this.productService.update(id, product);
  // }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: any
  ) {
    return this.productService.update(id, { ...body, images });
  }

  
  @Patch(':id/status')
  toggleStatus(@Param('id') id: string): Promise<Product> {
      return this.productService.toggleStatus(id);
  }
  
}
