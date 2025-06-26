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
      productDetails: body.productDetails
        ? JSON.parse(body.productDetails)
        : {},
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

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<any> {
    return this.productService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }

  @Patch(':id')
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
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ): Promise<Product> {
    const imageUrls = files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`,
    );

    const updateData: UpdateProductDto = {
      ...body,
      images: imageUrls, // ✅ روابط الصور
      tags: body.tags ? JSON.parse(body.tags) : [],
      productDetails: body.productDetails
        ? JSON.parse(body.productDetails)
        : {},
    };

    return this.productService.update(id, updateData);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string): Promise<Product> {
    return this.productService.toggleStatus(id);
  }

}
