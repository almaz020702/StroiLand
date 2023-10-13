import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { EmailVerificationService } from './email-verification.service';

@Controller('activation')
export class EmailVerificationController {
	constructor(private emailVerificationService: EmailVerificationService) {}

	@Get('/:activationLink')
	async activateAccount(@Req() req: Request) {
		const activationLink = req.params.activationLink;
        
		return this.emailVerificationService.activateAccount(activationLink);
	}
}
