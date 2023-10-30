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
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from 'src/interfaces/product.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserAuthGuard } from 'src/auth/user-auth.guard';

@Controller('admin')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Post('/createProduct')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@UseInterceptors(FileInterceptor('image'))
	async createProduct(
		@Body() productDto: CreateProductDto,
		@UploadedFile() file: Express.Multer.File,
	): Promise<void> {
		try {
			await this.adminService.createProduct(productDto, file);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to create the product',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
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
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('ADMIN')
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
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('ADMIN')
	async deleteProductById(@Req() req: Request): Promise<void> {
		try {
			this.adminService.deleteProductById(parseInt(req.params.id));
		} catch (e) {
			throw new InternalServerErrorException(
				'Failed to delete product with given ID',
			);
		}
	}
}
