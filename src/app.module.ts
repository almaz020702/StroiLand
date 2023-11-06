import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { AdminModule } from './admin/admin.module';
import { APP_PIPE } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { RolesModule } from './roles/roles.module';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { ReviewModule } from './review/review.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		AuthModule,
		UserModule,
		PrismaModule,
		EmailVerificationModule,
		AdminModule,
		OrderModule,
		ProductModule,
		PaymentModule,
		RolesModule,
		ShippingAddressModule,
		ReviewModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				// disableErrorMessages: true,
				transform: true,
				whitelist: true,
			}),
		},
	],
})
export class AppModule {}
