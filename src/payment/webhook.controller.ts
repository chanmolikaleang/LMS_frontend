import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CourseService } from 'src/course/course.service';
import Stripe from 'stripe';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private courseService: CourseService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    });
  }

  @Post()
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      // Use the rawBody for Stripe signature verification
      const rawBody = (req as any).rawBody;
      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Fetch metadata from the session
      const studentUid = session.metadata?.userUid;
      const courseUid = session.metadata?.courseUid;

      if (studentUid && courseUid) {
        try {
          // Enroll the student in the course
          await this.courseService.CourseEnrollment({ studentUid, courseUid });
          console.log(
            `✅ Student ${studentUid} enrolled in course ${courseUid}`,
          );
        } catch (err) {
          console.error('Enrollment failed:', err);
        }
      } else {
        console.log('Metadata missing userUid or courseUid.');
      }
    }

    return { received: true };
  }
}
