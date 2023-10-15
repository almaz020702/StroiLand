import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

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
	async logout(@Res({ passthrough: true }) res: Response) {
		return this.authService.logout(res);
	}
}
