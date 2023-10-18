import { Injectable, NotFoundException } from '@nestjs/common';
import { UserInfo } from 'src/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
