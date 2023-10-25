import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/interfaces/product.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
	constructor(private prismaService: PrismaService) {}

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
