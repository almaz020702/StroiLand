import { Module } from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { ShippingAddressController } from './shipping-address.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ShippingAddressService],
  controllers: [ShippingAddressController],
  imports: [PrismaModule],
  exports: [ShippingAddressService]
})
export class ShippingAddressModule {}
