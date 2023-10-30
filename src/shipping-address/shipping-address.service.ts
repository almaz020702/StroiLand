import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShippingAddressDto } from 'src/shipping-address/dtos/create-shipping-address.dto';
import { UpdateShippingAddressDto } from 'src/shipping-address/dtos/update-shipping-address.dto';
import { ShippingAddress } from 'src/shipping-address/interfaces/shippingAddress.interface';

@Injectable()
export class ShippingAddressService {
    constructor(private prismaService: PrismaService) {}

    async addShippingAddress(
		userId: number,
		createShippingAddressDto: CreateShippingAddressDto,
	): Promise<void> {
		await this.prismaService.shippingAddress.create({
			data: {
				...createShippingAddressDto,
				user: { connect: { user_id: userId } },
			},
		});
	}

	async getShippingAddresses(userId: number): Promise<ShippingAddress[]> {
		const shippingAddresses = await this.prismaService.shippingAddress.findMany(
			{ where: { user_id: userId } },
		);
		return shippingAddresses;
	}

	async updateShippingAddress(
		userId: number,
		updatedDto: UpdateShippingAddressDto,
		addressId: number,
	): Promise<void> {
		const shippingAddress = this.prismaService.shippingAddress.findUnique({
			where: { user_id: userId, address_id: addressId },
		});
		if (!shippingAddress) {
			throw new NotFoundException('Shipping Address was not found');
		}
		await this.prismaService.shippingAddress.update({
			where: { user_id: userId, address_id: addressId },
			data: {
				...updatedDto,
			},
		});
	}

	async deleteShippingAddress(
		userId: number,
		addressId: number,
	): Promise<void> {
		const shippingAddress = this.prismaService.shippingAddress.findUnique({
			where: { user_id: userId, address_id: addressId },
		});
		if (!shippingAddress) {
			throw new NotFoundException('Shipping Address was not found');
		}
		await this.prismaService.shippingAddress.delete({
			where: { user_id: userId, address_id: addressId },
		});
	}
}
