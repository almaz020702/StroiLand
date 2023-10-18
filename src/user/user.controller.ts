import { Controller, Get, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { UserInfo } from 'src/interfaces/user.interface';
import { UserService } from './user.service';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { User } from './user.decorator';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@UseGuards(UserAuthGuard)
	async getUserInfo(@User() user: TokenPayload): Promise<UserInfo> {
		try {
			return this.userService.getUserInfo(user.id);
		} catch {
			throw new InternalServerErrorException("Failed tp retrieve information about the user")
		}
	}
}
