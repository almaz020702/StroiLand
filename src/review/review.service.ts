import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
	constructor(private prismaService: PrismaService) {}

	async createReview(
		userId: number,
		createReviewDto: CreateReviewDto,
	): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: { user_id: userId },
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}
        

		await this.prismaService.review.create({
			data: {
				review_text: createReviewDto.review_text,
				rating: createReviewDto.rating,
				product: {
					connect: {
						product_id: createReviewDto.product_id,
					},
				},
				user: {
					connect: {
						user_id: userId,
					},
				},
			},
		});
	}
}
