import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentResolver]
})
export class PaymentModule {}
