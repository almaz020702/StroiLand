import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Injectable()
export class PaymentService {
    constructor(private prismaService: PrismaService){}

    async createPaymentMethod(userId: number, createPaymentMethodDto: CreatePaymentMethodDto): Promise<void> {
        await this.prismaService.paymentInfo.create({data: {
            ...createPaymentMethodDto,
            user: { connect: { user_id: userId } },
        }})
    }
}
