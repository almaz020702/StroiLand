import { IsString, IsNotEmpty, IsPostalCode, IsISO31661Alpha3 } from 'class-validator';

export class CreateShippingAddressDto {
    @IsNotEmpty({ message: 'Street address is required' })
    @IsString({ message: 'Street address must be a string' })
    street_address: string;

    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @IsNotEmpty({ message: 'Postal code is required' })
    @IsPostalCode('any', { message: 'Invalid postal code' })
    postal_code: string;

    @IsNotEmpty({ message: 'Country is required' })
    @IsISO31661Alpha3({ message: 'Invalid country code' })
    country: string;
}
