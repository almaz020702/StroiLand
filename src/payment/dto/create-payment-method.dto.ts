import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreatePaymentMethodDto {
    @IsNotEmpty({ message: 'Cardholder name is required' })
    @IsString({ message: 'Cardholder name must be a string' })
    cardholder_name: string;

    @IsNotEmpty({ message: 'Card number is required' })
    @Matches(/\b\d{13,19}\b/, { message: 'Invalid card number' })
    card_number: string;

    @IsNotEmpty({ message: 'Expiration date is required' })
    @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Invalid expiration date format (MM/YY)' })
    expiration_date: string;

    @IsNotEmpty({ message: 'CVV is required' })
    @Matches(/^\d{3,4}$/, { message: 'Invalid CVV format (3 or 4 digits)' })
    cvv: string;
}
