import {
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	Post,
	Put,
	Req,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from 'src/interfaces/product.interface';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('admin')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Post('/createProduct')
	@UseInterceptors(FileInterceptor('image'))
	async createProduct(
		@Body() productDto: CreateProductDto,
		@UploadedFile() file: Express.Multer.File,
	): Promise<void> {
		try {
			await this.adminService.createProduct(productDto, file);
		} catch (error) {
			throw new InternalServerErrorException('Failed to create the product');
		}
	}

	@Get('/products')
	async getAllProducts(): Promise<Product[]> {
		try {
			const products = await this.adminService.getAllProducts();
			return products;
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve products');
		}
	}

	@Get('/products/:id')
	async getProductById(@Req() req: Request): Promise<Product> {
		try {
			return this.adminService.getProductById(parseInt(req.params.id));
		} catch (e) {
			throw new InternalServerErrorException(
				'Failed to retrieve product with given ID',
			);
		}
	}

	@Put('/products/:id')
	async updateProductById(
		@Req() req: Request,
		@Body() updatedDto: UpdateProductDto,
	): Promise<void> {
		try {
			this.adminService.updateProductById(parseInt(req.params.id), updatedDto);
		} catch (e) {
			throw new InternalServerErrorException(
				'Failed to update product with given ID',
			);
		}
	}

    @Delete('products/:id')
    async deleteTaskById(@Req() req: Request): Promise<void> {
        try {
            this.adminService.deleteProductById(parseInt(req.params.id))
        } catch (e) {
            throw new InternalServerErrorException(
				'Failed to delete product with given ID',
			);
        }
    }
}
