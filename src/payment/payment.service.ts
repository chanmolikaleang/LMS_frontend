import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-03-31.basil',
  });

  async createCheckoutSession(
    userUid: string,
    courseUid: string,
    price: number,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Course #${courseUid}` },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://pp-frontend-final.onrender.com/payment-success',
      cancel_url: 'https://pp-frontend-final.onrender.com/payment-cancel',
      metadata: {
        userUid,
        courseUid,
      },
    });

    return session.id;
  }
}
