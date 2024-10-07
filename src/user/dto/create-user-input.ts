import { Field, InputType } from '@nestjs/graphql';
// import { Role } from '@prisma/client';
import { Role } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Role, { nullable: true })
  role: Role;
}
