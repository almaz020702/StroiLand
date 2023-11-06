import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';

export class UpdateReviewDto {
    @IsOptional()
	@IsInt()
	@Min(1)
	@Max(5)
	rating: number;

    @IsOptional()
	@IsString()
	review_text: string;
}
