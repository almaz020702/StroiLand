import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private prismaService: PrismaService,
		private emailVerificationService: EmailVerificationService,
	) {}

	async registration(userDto: CreateUserDto, res: Response) {
		const candidate = await this.prismaService.user.findUnique({
			where: {
				email: userDto.email,
			},
		});
		if (candidate) {
			throw new HttpException(
				'User with this email already exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		const activationToken =
			await this.emailVerificationService.generateActivationToken(
				userDto.email,
			);
		const hashedPassword = await bcrypt.hash(userDto.password, 5);
		const user = await this.prismaService.user.create({
			data: {
				email: userDto.email,
				password: hashedPassword,
				activationToken,
			},
		});
		const token = this.jwtService.sign({
			id: user.user_id,
			email: user.email,
		});
		res.cookie('accessToken', token, {
			maxAge: 60 * 60 * 1000,
			httpOnly: true,
		});
		await this.emailVerificationService.sendVerificationEmail(
			user.email,
			activationToken,
		);
		return {
			message: 'User registration successful',
			user: {
				id: user.user_id,
				email: user.email,
			},
			accessToken: token,
		};
	}

	async login(userDto: CreateUserDto, res: Response) {
		const candidate = await this.prismaService.user.findUnique({
			where: { email: userDto.email },
		});
		if (!candidate) {
			throw new HttpException(
				'User with this email does not exist',
				HttpStatus.BAD_REQUEST,
			);
		}
		const comparePassword = bcrypt.compareSync(
			userDto.password,
			candidate.password,
		);
		if (!comparePassword) {
			throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
		}
		const token = this.jwtService.sign({
			id: candidate.user_id,
			email: candidate.email,
		});
		res.cookie('accessToken', token, {
			maxAge: 60 * 60 * 1000,
			httpOnly: true,
		});
		return {
			message: 'User login successful',
			user: {
				id: candidate.user_id,
				email: candidate.email,
			},
			accessToken: token,
		};
	}

	async logout(res: Response) {
		res.clearCookie('accessToken');
		return { message: 'User successfully logged out' };
	}
}
