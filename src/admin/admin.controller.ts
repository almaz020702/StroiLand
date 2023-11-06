import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Post,
	Put,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { Product } from 'src/product/interfaces/product.interface';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { ProductService } from 'src/product/product.service';

@Controller('admin')
export class AdminController {
	constructor(private productService: ProductService) {}

	@Post('/createProduct')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@UseInterceptors(FileInterceptor('image'))
	async createProduct(
		@Body() productDto: CreateProductDto,
		@UploadedFile() file: Express.Multer.File,
	): Promise<void> {
		try {
			await this.productService.createProduct(productDto, file);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to create the product',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put('/products/:id')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('ADMIN')
	async updateProductById(
		@Req() req: Request,
		@Body() updatedDto: UpdateProductDto,
	): Promise<void> {
		try {
			this.productService.updateProductById(
				parseInt(req.params.id),
				updatedDto,
			);
		} catch (e) {
			throw new InternalServerErrorException(
				'Failed to update product with given ID',
			);
		}
	}

	@Delete('products/:id')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('ADMIN')
	async deleteProductById(@Req() req: Request): Promise<void> {
		try {
			this.productService.deleteProductById(parseInt(req.params.id));
		} catch (e) {
			throw new InternalServerErrorException(
				'Failed to delete product with given ID',
			);
		}
	}
}
