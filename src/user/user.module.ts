import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailVerificationModule } from 'src/email-verification/email-verification.module';

@Module({
	providers: [UserService],
	controllers: [UserController],
	imports: [
		PrismaModule,
		EmailVerificationModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: {
				expiresIn: '1h',
			},
		}),
	],
})
export class UserModule {}
