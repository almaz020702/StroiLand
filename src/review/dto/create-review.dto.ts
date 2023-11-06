import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
	@IsInt()
	@Min(1)
	@Max(5)
	rating: number;

	@IsString()
	review_text: string;
}
