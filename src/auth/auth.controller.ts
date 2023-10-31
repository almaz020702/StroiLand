import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './user-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User } from 'src/user/user.decorator';
import { TokenPayload } from './interfaces/token-payload.interface';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/registration')
	async registration(
		@Res({ passthrough: true }) res: Response,
		@Body() userDto: CreateUserDto,
	) {
		return await this.authService.registration(userDto, res);
	}

	@Post('/login')
	async login(
		@Res({ passthrough: true }) res: Response,
		@Body() userDto: CreateUserDto,
	) {
		return await this.authService.login(userDto, res);
	}

	@Post('/logout')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async logout(@Res({ passthrough: true }) res: Response) {
		return this.authService.logout(res);
	}

	@Post('/refresh')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async refreshToken(
		@User() user: TokenPayload,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.refreshToken(user.id, res);
	}
}
