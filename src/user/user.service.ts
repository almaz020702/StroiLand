import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { UserInfo } from 'src/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import * as bcrypt from 'bcryptjs';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { Order } from 'src/interfaces/order.interface';

@Injectable()
export class UserService {
	constructor(
		private prismaService: PrismaService,
		private emailVerificationService: EmailVerificationService,
	) {}

	async getUserInfo(userId: number): Promise<UserInfo> {
		const user: UserInfo = await this.prismaService.user.findUnique({
			where: { user_id: userId },
			select: {
				user_id: true,
				email: true,
				first_name: true,
				last_name: true,
				phone_number: true,
				isActivated: true,
			},
		});
		if (!user) {
			throw new NotFoundException('User was not found');
		}
		return user;
	}

	async updateUserInfo(
		userId: number,
		updatedData: UpdateUserInfoDto,
	): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: { user_id: userId },
		});
		if (!user) {
			throw new NotFoundException('User was not found');
		}
		if (updatedData.password) {
			const hashedPassword = await bcrypt.hash(updatedData.password, 5);
			updatedData.password = hashedPassword;
		}
		if (!updatedData.email) {
			await this.prismaService.user.update({
				where: { user_id: userId },
				data: {
					...updatedData,
				},
			});
		}
		const emailCheck = await this.prismaService.user.findUnique({
			where: { email: updatedData.email },
		});
		if (emailCheck) {
			throw new BadRequestException('User with this email already exists');
		}
		const activationToken =
			await this.emailVerificationService.generateActivationToken(
				updatedData.email,
			);
		await this.prismaService.user.update({
			where: { user_id: userId },
			data: {
				...updatedData,
				isActivated: false,
				activationToken,
			},
		});
		this.emailVerificationService.sendVerificationEmail(
			updatedData.email,
			activationToken,
		);
	}

	async getOrdersOfUser(userId: number): Promise<Order[]> {
		const orders = this.prismaService.order.findMany({
			where: { user_id: userId },
		});
		return orders;
	}
}
