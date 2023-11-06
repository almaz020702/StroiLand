import {
    Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { Request } from 'express';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User } from 'src/user/user.decorator';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { ReviewService } from 'src/review/review.service';

@Controller('products')
export class ProductController {
	constructor(
		private productService: ProductService,
		private reviewService: ReviewService,
	) {}

	@Get('')
	async getAllProducts(): Promise<Product[]> {
		try {
			const products = await this.productService.getAllProducts();
			return products;
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve products');
		}
	}

	@Get('/:id')
	async getProductById(@Req() req: Request): Promise<Product> {
		try {
			return await this.productService.getProductById(parseInt(req.params.id));
		} catch (e) {
			throw new InternalServerErrorException(
				'Failed to retrieve product with given ID',
			);
		}
	}

	@Post('/reviews')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async createReview(
		@User() user: TokenPayload,
		@Body() createReviewDto: CreateReviewDto,
	): Promise<void> {
		try {
			await this.reviewService.createReview(user.id, createReviewDto);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to update shipping addresse',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
