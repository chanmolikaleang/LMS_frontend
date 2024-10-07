import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class SimpleFilter {
  @Field({ nullable: true })
  search?: string = '';

  @Field({ nullable: true })
  @IsNumber({ maxDecimalPlaces: 0 })
  take?: number = 20;
}
