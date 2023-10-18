import { Injectable, NotFoundException } from '@nestjs/common';
import { UserInfo } from 'src/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

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
            updatedData.password = hashedPassword
        }
		await this.prismaService.user.update({
			where: { user_id: userId },
			data: {
				...updatedData,
			},
		});
	}
}
