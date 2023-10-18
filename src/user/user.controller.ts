import {
	Body,
	Controller,
	Get,
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

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@UseGuards(UserAuthGuard)
	async getUserInfo(@User() user: TokenPayload): Promise<UserInfo> {
		try {
			return this.userService.getUserInfo(user.id);
		} catch {
			throw new InternalServerErrorException(
				'Failed to retrieve information about the user',
			);
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
		} catch {
			throw new InternalServerErrorException(
				'Failed to update information about the user',
			);
		}
	}
}
