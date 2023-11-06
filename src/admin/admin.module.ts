import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from 'src/product/product.module';

@Module({
	imports: [
		PrismaModule,
		ProductModule,
		UserModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: {
				expiresIn: '1h',
			},
		}),
	],
	providers: [AdminService],
	controllers: [AdminController],
})
export class AdminModule {}
