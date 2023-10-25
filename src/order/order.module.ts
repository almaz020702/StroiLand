import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [PrismaModule, ProductModule],
  exports: [OrderService]
})
export class OrderModule {}
