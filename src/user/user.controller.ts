import {
	Body,
	Controller,
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
import { UserInfo } from 'src/interfaces/user-info.interface';
import { UserService } from './user.service';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { User } from './user.decorator';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Order } from 'src/interfaces/order.interface';
import { OrderService } from 'src/order/order.service';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Request } from 'express';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService, private orderService: OrderService) {}

	@Get()
	@UseGuards(UserAuthGuard)
	async getUserInfo(@User() user: TokenPayload): Promise<UserInfo> {
		try {
			return this.userService.getUserInfo(user.id);
		} catch (e) {
			throw new HttpException(e.message || 'Failed to retrieve information about the user', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Put()
	@UseGuards(UserAuthGuard)
	async updateUserInfo(
		@User() user: TokenPayload,
		@Body() updatedData: UpdateUserInfoDto,
	): Promise<void> {
		try {
			await this.userService.updateUserInfo(user.id, updatedData);
		} catch (e) {
			throw new HttpException(e.message || 'Failed to update information about the user', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('/orders')
	@UseGuards(UserAuthGuard)
	async getOrderOfUser (@User() user: TokenPayload): Promise<Order[]> {
		try {
			return await this.userService.getOrdersOfUser(user.id);
		} catch (e) {
			throw new HttpException(e.message || 'Failed to get the information about the users orders', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post('/orders')
	@UseGuards(UserAuthGuard)
	async makeOrder(@User() user: TokenPayload, @Body() orderDto: CreateOrderDto): Promise<Order> {
		try {
			return await this.orderService.createOrder(user.id, orderDto);
		} catch (e) {
			throw new HttpException(e.message || 'Failed to get the information about the users orders', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('orders/:id')
	@UseGuards(UserAuthGuard)
	async getOrderById(@User() user: TokenPayload, @Req() req: Request): Promise<Order> {
		try {
			return await this.orderService.getOrderById(user.id, parseInt(req.params.id))
		} catch (e) {
			throw new HttpException(e.message || 'Failed to get the information about the order with given ID', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post('/shippingAddress')
	@UseGuards(UserAuthGuard)
	async addShippingAddress(@User() user: TokenPayload, @Body() createShippingAddressDto: CreateShippingAddressDto): Promise<void> {
		try {
			await this.userService.addShippingAddress(user.id, createShippingAddressDto)
		} catch (e) {
			throw new HttpException(e.message || 'Failed to add shipping address', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
