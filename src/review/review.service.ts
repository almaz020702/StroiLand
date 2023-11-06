import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product } from 'src/product/interfaces/product.interface';
import { Review } from './interfaces/review.interface';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
	constructor(private prismaService: PrismaService) {}

	async updateProductRating(productId: number) {
		const product = await this.prismaService.product.findUnique({
			where: { product_id: productId },
			include: {
				Review: {
					select: {
						rating: true,
					},
				},
			},
		});

		if (!product) {
			return;
		}

		// Calculate the average rating
		const reviews = product.Review;
		const totalRatings = reviews.reduce(
			(acc, review) => acc + review.rating,
			0,
		);
		const averageRating = totalRatings / reviews.length;

		// Update the product's rating
		await this.prismaService.product.update({
			where: { product_id: productId },
			data: {
				rating: averageRating,
			},
		});
	}

	async createReview(
		userId: number,
		productId: number,
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
						product_id: productId,
					},
				},
				user: {
					connect: {
						user_id: userId,
					},
				},
			},
		});

		await this.updateProductRating(productId);
	}

	async getAllReviewsOfProduct(productId: number): Promise<Review[]> {
		return await this.prismaService.review.findMany({
			where: { product_id: productId },
		});
	}

	async getReviewById(reviewId: number): Promise<Review> {
		const review = await this.prismaService.review.findUnique({
			where: { review_id: reviewId },
		});
		if (!review) {
			throw new NotFoundException('Review was not found');
		}
		return review;
	}

	async updateReview(
		userId: number,
		reviewId: number,
		updatedDto: UpdateReviewDto,
	): Promise<void> {
		const reviewToUpdate = await this.prismaService.review.findUnique({
			where: { review_id: reviewId, user_id: userId },
		});
		if (!reviewToUpdate) {
			throw new NotFoundException('Review was not found');
		}

		const updatedReview = await this.prismaService.review.update({
			where: { review_id: reviewId, user_id: userId },
			data: {
				...updatedDto,
			},
		});

		await this.updateProductRating(updatedReview.product_id);
	}

	async deleteReview(userId: number, reviewId: number): Promise<Review> {
		const reviewToDelete = await this.prismaService.review.findUnique({
			where: { user_id: userId, review_id: reviewId },
		});
		if (!reviewToDelete) {
			throw new NotFoundException('Review was not found');
		}

		const deletedReview = await this.prismaService.review.delete({
			where: { user_id: userId, review_id: reviewId },
		});

		await this.updateProductRating(deletedReview.product_id);
		return deletedReview;
	}

	async getReviewsOfUser(userId: number): Promise<Review[]> {
		const user = await this.prismaService.user.findUnique({
			where: { user_id: userId },
		});
		if (!user) {
			throw new NotFoundException('User was not found');
		}

		const reviews = await this.prismaService.review.findMany({
			where: { user_id: userId },
		});
		return reviews;
	}
}
