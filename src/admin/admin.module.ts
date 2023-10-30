import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		PrismaModule,
		RolesModule,
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
