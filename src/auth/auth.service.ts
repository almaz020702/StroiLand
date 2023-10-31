import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { TokenPair } from './interfaces/token-pair.interface';
import { User } from 'src/user/interfaces/user.interface';

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
				roles: {
					create: [
						{
							Role: {
								connectOrCreate: {
									where: {
										name: 'USER',
									},
									create: {
										name: 'USER',
									},
								},
							},
						},
					],
				},
			},
		});
		const tokens = this.generateTokens(user);
		this.sendTokensInCookie(tokens, res);
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
			tokens: tokens,
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
		const tokens = this.generateTokens(candidate);
		this.sendTokensInCookie(tokens, res);
		return {
			message: 'User login successful',
			user: {
				id: candidate.user_id,
				email: candidate.email,
			},
			tokens,
		};
	}

	async logout(res: Response): Promise<{ message: string }> {
		this.clearTokensInCookie(res);
		return { message: 'User successfully logged out' };
	}

	private generateTokens(user: User): TokenPair {
		const accessToken = this.jwtService.sign({
			id: user.user_id,
			email: user.email,
		});
		const refreshToken = this.jwtService.sign({ email: user.email });
		return { accessToken, refreshToken };
	}

	private sendTokensInCookie(
		tokens: { accessToken: string; refreshToken: string },
		res: Response,
	): void {
		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 60 * 60 * 1000,
			httpOnly: true,
		});
		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 60 * 60 * 1000 * 24,
			httpOnly: true,
		});
	}

	private clearTokensInCookie(res: Response): void {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
	}

	async refreshToken(userId: number, res: Response) {
		const user = await this.prismaService.user.findUnique({
			where: { user_id: userId },
		});
		const tokens = this.generateTokens(user);
		this.sendTokensInCookie(tokens, res);

		return {
			message: 'Tokens were refreshed',
			tokens,
		};
	}
}
