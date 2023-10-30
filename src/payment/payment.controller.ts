import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { User } from 'src/user/user.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentInfo } from 'src/interfaces/payment-info.interface';

@Controller('user/payment')
export class PaymentController {
	constructor(private paymentService: PaymentService) {}

	// @Post()
	// @UseGuards(UserAuthGuard)
	// async createPaymentMethod(
	// 	@User() user: TokenPayload,
	// 	@Body() createPaymentMethodDto: CreatePaymentMethodDto,
	// ): Promise<void> {
	// 	try {
	// 		await this.paymentService.createPaymentMethod(
	// 			user.id,
	// 			createPaymentMethodDto,
	// 		);
	// 	} catch (e) {
	// 		throw new HttpException(
	// 			e.message || 'Failed to add a payment method',
	// 			e.status || HttpStatus.INTERNAL_SERVER_ERROR,
	// 		);
	// 	}
	// }

    // @Get()
    // @UseGuards(UserAuthGuard)
    // async getPaymentMethods(userId: number): Promise<PaymentInfo[]> {
    //     try {
			
	// 	} catch (e) {
	// 		throw new HttpException(
	// 			e.message || 'Failed to add a payment method',
	// 			e.status || HttpStatus.INTERNAL_SERVER_ERROR,
	// 		);
	// 	}
    // }
}
