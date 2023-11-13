import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/interfaces/product.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FilterQueryDto } from './dto/filter-query.dto';

@Injectable()
export class ProductService {
	constructor(private prismaService: PrismaService) {}

	async createProduct(
		productDto: CreateProductDto,
		file: Express.Multer.File,
	): Promise<void> {
		if (!file) {
			throw new BadRequestException('No file uploaded');
		}
		const uploadDirectory = './dist/uploads';

		if (!fs.existsSync(uploadDirectory)) {
			fs.mkdirSync(uploadDirectory, { recursive: true });
		}
		const imageFolderPath = path.join(__dirname, '..', '..', 'uploads');
		const imageName = uuidv4() + '.jpg';
		const imagePath = path.join(imageFolderPath, imageName);
		try {
			fs.writeFileSync(imagePath, file.buffer);
		} catch (error) {
			console.error('Error saving the image:', error);
			throw new InternalServerErrorException('Image could not be saved');
		}
		const newProduct = await this.prismaService.product.create({
			data: {
				name: productDto.name,
				description: productDto.description,
				price: productDto.price,
				stock_quantity: productDto.stock_quantity,
				image_url: imagePath,
				category: { connect: { category_id: productDto.category_id } },
			},
		});
	}

	async getAllProducts(
		paginationDto: PaginationQueryDto,
		search?: string,
		filterDto?: FilterQueryDto,
	): Promise<Product[]> {
		const offset = (paginationDto.page - 1) * paginationDto.limit;

		const where = {};

		// Apply search criteria
		if (search) {
			where['OR'] = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
			];
		}

		// Filtering
		if (filterDto.category) {
			where['category'] = { name: { equals: filterDto.category } };
		  }

		if (filterDto.priceMin !== undefined && filterDto.priceMax !== undefined) {
			where['price'] = { gte: filterDto.priceMin, lte: filterDto.priceMax };
		} else if (filterDto.priceMin !== undefined) {
			where['price'] = { gte: filterDto.priceMin };
		} else if (filterDto.priceMax !== undefined) {
			where['price'] = { lte: filterDto.priceMax };
		}

		return this.prismaService.product.findMany({
			skip: offset,
			take: paginationDto.limit,
			where,
		});
	}

	async getProductById(productId: number): Promise<Product> {
		const product = await this.prismaService.product.findUnique({
			where: { product_id: productId },
		});
		if (!product) {
			throw new NotFoundException('The product with given ID was not found');
		}
		return product;
	}

	async updateProductById(
		productId: number,
		updatedDto: UpdateProductDto,
	): Promise<void> {
		const product = this.prismaService.product.findUnique({
			where: { product_id: productId },
		});
		if (!product) {
			throw new NotFoundException('The product with given ID was not found');
		}
		await this.prismaService.product.update({
			where: { product_id: productId },
			data: {
				...updatedDto,
			},
		});
	}

	async deleteProductById(productId: number): Promise<void> {
		const productToDelete = await this.prismaService.product.findUnique({
			where: { product_id: productId },
		});
		if (!productToDelete) {
			throw new NotFoundException('The product with given ID was not found');
		}
		await this.prismaService.product.delete({
			where: { product_id: productId },
		});
	}

	async getProducts(productIds: number[]): Promise<Product[]> {
		const products = await this.prismaService.product.findMany({
			where: {
				product_id: {
					in: productIds,
				},
			},
		});

		// Check if all requested product IDs were found
		if (products.length !== productIds.length) {
			const missingProductIds = productIds.filter(
				(productId) =>
					!products.some((product) => product.product_id === productId),
			);
			throw new NotFoundException(
				`Products not found: ${missingProductIds.join(', ')}`,
			);
		}

		return products;
	}
}
