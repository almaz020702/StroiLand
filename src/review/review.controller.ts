import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';
import { Review } from './interfaces/review.interface';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User } from 'src/user/user.decorator';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
	constructor(private reviewService: ReviewService) {}

	@Get('/:reviewId')
	async getReviewById(@Req() req: Request): Promise<Review> {
		try {
			return await this.reviewService.getReviewById(
				parseInt(req.params.reviewId),
			);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to get review',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put('/:reviewId')
	@UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
	async updateReview(
		@User() user: TokenPayload,
		@Req() req: Request,
		@Body() updatedDto: UpdateReviewDto,
	): Promise<void> {
		try {
			await this.reviewService.updateReview(
				user.id,
				parseInt(req.params.reviewId),
				updatedDto,
			);
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to update review',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

    @Delete('/:reviewId')
    @UseGuards(UserAuthGuard, RolesGuard)
	@Roles('USER', 'ADMIN')
    async deleteReview(@User() user: TokenPayload, @Req() req: Request): Promise<Review> {
        try {
			return await this.reviewService.deleteReview(user.id, parseInt(req.params.reviewId))
		} catch (e) {
			throw new HttpException(
				e.message || 'Failed to delete review',
				e.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
    }
}
