import {
	IsString,
	IsPostalCode,
	IsISO31661Alpha3,
	IsOptional,
} from 'class-validator';

export class UpdateShippingAddressDto {
	@IsOptional()
	@IsString({ message: 'Street address must be a string' })
	street_address: string;

	@IsOptional()
	@IsString({ message: 'City must be a string' })
	city: string;

	@IsOptional()
	@IsPostalCode('any', { message: 'Invalid postal code' })
	postal_code: string;

	@IsOptional()
	@IsISO31661Alpha3({ message: 'Invalid country code' })
	country: string;
}
