import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Classroom {
  @Field()
  code: string;

  @Field()
  name: string;
}
