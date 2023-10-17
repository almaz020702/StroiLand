import {
	BadRequestException,
	HttpException,
	Injectable,
	InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Product } from 'src/interfaces/product.interface';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class AdminService {
	constructor(private prismaService: PrismaService) {}

	async createProduct(productDto: CreateProductDto, file: Express.Multer.File): Promise<void> {
		if (!file) {
			throw new BadRequestException('No file uploaded');
		}
		const imageFolderPath = path.join(__dirname, '..', 'uploads');
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
				...productDto,
				image_url: imagePath,
			},
		});
	}

	async getAllProducts(): Promise<Product[]> {
		return await this.prismaService.product.findMany();
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

    async updateProductById (productId: number, updatedDto: UpdateProductDto): Promise<void> {
        const product = this.prismaService.product.findUnique({where: {product_id: productId}})
        if (!product) {
            throw new NotFoundException('The product with given ID was not found');
        }
        await this.prismaService.product.update({where: {product_id: productId}, data: {
            ...updatedDto
        }})
    }

    async deleteProductById (productId: number): Promise<void> {
        const productToDelete = await this.prismaService.product.findUnique({where: {product_id: productId}})
        if (!productToDelete) {
            throw new NotFoundException('The product with given ID was not found');
        }
        await this.prismaService.product.delete({where: {product_id: productId}})
    } 
}
