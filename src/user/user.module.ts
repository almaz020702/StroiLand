import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailVerificationModule } from 'src/email-verification/email-verification.module';
import { OrderModule } from 'src/order/order.module';
import { ShippingAddressModule } from 'src/shipping-address/shipping-address.module';

@Module({
	providers: [UserService],
	controllers: [UserController],
	imports: [
		PrismaModule,
		EmailVerificationModule,
		OrderModule,
		ShippingAddressModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: {
				expiresIn: '1h',
			},
		}),
	],
	exports: [UserService]
})
export class UserModule {}
