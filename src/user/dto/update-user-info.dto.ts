import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoDto {
    @IsOptional() 
    @IsEmail()  
    email: string;

    @IsOptional() 
    @IsString()   
    first_name: string;

    @IsOptional() 
    @IsString()  
    last_name: string;

    @IsOptional()
    @IsString() 
    phone_number: string;

    @IsOptional()
    @IsString()
    password: string;
}
