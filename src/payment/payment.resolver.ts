import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => String)
  async createCheckout(
    @Args('userUid') userUid: string,
    @Args('courseUid') courseUid: string,
    @Args('price') price: number,
  ) {
    return this.paymentService.createCheckoutSession(userUid, courseUid, price);
  }
}
