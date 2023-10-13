import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailVerificationService {
	private transporter;

	constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
	) {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
		});
	}

	async generateActivationToken(email: string): Promise<string> {
		const token = this.jwtService.sign({ email });

		// Construct the verification link
		//const activationLink = `${process.env.API_URL}/activation/${token}`;

		return token;
	}

	async activateAccount(activationToken: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				activationToken,
			},
		});
		if (user.activationToken != activationToken || !user) {
			throw new HttpException('Wrong activation link!', HttpStatus.BAD_REQUEST);
		}
		const activatedUser = await this.prismaService.user.update({
			where: { user_id: user.user_id },
			data: {
				isActivated: true,
				activationToken: null,
			},
		});
		return activatedUser;
	}

	async sendVerificationEmail (to: string, verificationToken: string): Promise<void> {
		const mailOptions = {
			from: process.env.SMTP_USER,
			to,
			subject: 'Account Verification',
			html: `Click the following link to verify your account: <a href="${process.env.API_URL}/activation/${verificationToken}">Verify Account</a>`,
		  };
	  
		  await this.transporter.sendMail(mailOptions);
	}
}
