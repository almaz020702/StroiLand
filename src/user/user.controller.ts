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
	UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { UserInfo } from 'src/user/interfaces/user-info.interface';
import { UserService } from './user.service';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { User } from './user.decorator';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Order } from 'src/order/interfaces/order.interface';
import { OrderService } from 'src/order/order.service';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Request } from 'express';
import { CreateShippingAddressDto } from '../shipping-address/dtos/create-shipping-address.dto';
import { ShippingAddress } from 'src/shipping-address/interfaces/shippingAddress.interface';
import { UpdateShippingAddressDto } from '../shipping-address/dtos/update-shipping-address.dto';
import { ShippingAddressService } from 'src/shipping-address/shipping-address.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ReviewService } from 'src/review/review.service';
import { Review } from 'src/review/interfaces/review.interface';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private orderService: OrderService,
		private shippingAddressService: ShippingAddressService,
		private reviewService: ReviewService,
	) {}

	@Get()
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async getUserInfo(@User() user: TokenPayload): Promise<UserInfo> {
		try {
			return await this.userService.getUserInfo(user.id);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to retrieve information about the user',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put()
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async updateUserInfo(
		@User() user: TokenPayload,
		@Body() updatedData: UpdateUserInfoDto,
	): Promise<void> {
		try {
			await this.userService.updateUserInfo(user.id, updatedData);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to update information about the user',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('/orders')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async getOrdersOfUser(@User() user: TokenPayload): Promise<Order[]> {
		try {
			return await this.orderService.getOrdersOfUser(user.id);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to get the information about the users orders',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('/orders')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async createOrder(
		@User() user: TokenPayload,
		@Body() orderDto: CreateOrderDto,
	): Promise<Order> {
		try {
			return await this.orderService.createOrder(user.id, orderDto);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to get the information about the users orders',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('orders/:id')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async getOrderById(
		@User() user: TokenPayload,
		@Req() req: Request,
	): Promise<Order> {
		try {
			return await this.orderService.getOrderById(
				user.id,
				parseInt(req.params.id),
			);
		} catch (e) {
			throw new HttpException(
				e.message ||
					'Failed to get the information about the order with given ID',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('/shippingAddress')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async addShippingAddress(
		@User() user: TokenPayload,
		@Body() createShippingAddressDto: CreateShippingAddressDto,
	): Promise<void> {
		try {
			await this.shippingAddressService.addShippingAddress(
				user.id,
				createShippingAddressDto,
			);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to add shipping address',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('/shippingAddress')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async getShippingAddresses(
		@User() user: TokenPayload,
	): Promise<ShippingAddress[]> {
		try {
			return this.shippingAddressService.getShippingAddresses(user.id);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to get shipping addresses',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put('shippingAddress/:addressId')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async updateShippingAddress(
		@User() user: TokenPayload,
		@Body() updatedDto: UpdateShippingAddressDto,
		@Req() req: Request,
	): Promise<void> {
		try {
			this.shippingAddressService.updateShippingAddress(
				user.id,
				updatedDto,
				parseInt(req.params.addressId),
			);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to update shipping addresses',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Delete('shippingAddress/:addressId')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async deleteShippingAddress(
		@User() user: TokenPayload,
		@Req() req: Request,
	): Promise<void> {
		try {
			await this.shippingAddressService.deleteShippingAddress(
				user.id,
				parseInt(req.params.addressId),
			);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to delete shipping addresses',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('/reviews')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async getReviewsOfUser(@User() user: TokenPayload): Promise<Review[]> {
		try {
			return await this.reviewService.getReviewsOfUser(user.id);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to get reviews of the user',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
