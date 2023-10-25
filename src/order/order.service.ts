import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/interfaces/order.interface';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
	constructor(
		private prismaService: PrismaService,
		private productService: ProductService,
	) {}

	async createOrder(
		userId: number,
		createOrderDto: CreateOrderDto,
	): Promise<Order> {
		const user = await this.prismaService.user.findUnique({
			where: { user_id: userId },
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		// Check product availability
		const products = await this.productService.getProducts(
			createOrderDto.productIds,
		);

		// Ensure all selected products are available and in sufficient quantity
		const productQuantityMap = new Map();

		let i = 0;
		createOrderDto.productIds.forEach((productId) => {
			const quantity = createOrderDto.quantities[i];
			productQuantityMap.set(productId, quantity);
			i++;
		});

		const insufficientProducts = products.filter((product) => {
			const requestedQuantity = productQuantityMap.get(product.product_id);
			return product.stock_quantity < requestedQuantity;
		});

		if (insufficientProducts.length > 0) {
			throw new BadRequestException('Insufficient product stock');
		}

		// Calculate order total based on product prices and quantities
		const orderTotal = products.reduce((total, product) => {
			const quantity = productQuantityMap.get(product.product_id);
			return total + product.price * quantity;
		}, 0);

		// Create order items
		const orderItems = products.map((product) => ({
			product_id: product.product_id,
			quantity: productQuantityMap.get(product.product_id),
			subtotal: product.price * productQuantityMap.get(product.product_id),
		}));

		// Step 4: Update product stock
		for (const product of products) {
			const requestedQuantity = productQuantityMap.get(product.product_id);
			const updatedStockQuantity = product.stock_quantity - requestedQuantity;
			await this.prismaService.product.update({
				where: { product_id: product.product_id },
				data: { stock_quantity: updatedStockQuantity },
			});
		}

		// Step 5: Create and save the order
		const createdOrder = await this.prismaService.order.create({
			data: {
				user: { connect: { user_id: user.user_id } },
				total_price: orderTotal,
				order_items: { create: orderItems },
				status: 'Pending',
				order_date: new Date(),
			},
		});

		// Return the created order
		return createdOrder;
	}
}
