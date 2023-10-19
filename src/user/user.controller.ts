import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Put,
	UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { UserInfo } from 'src/interfaces/user.interface';
import { UserService } from './user.service';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { User } from './user.decorator';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Order } from 'src/interfaces/order.interface';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

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
}
