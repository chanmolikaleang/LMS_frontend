import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubjectInput {
  @Field()
  code: string;

  @Field()
  name: string;

  // @Field(() => [String], { nullable: true })
  // TecherUids: string[];
}
