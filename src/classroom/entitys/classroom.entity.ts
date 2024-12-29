import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Classroom {
  @Field()
  uid: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => User, { nullable: true })
  teacher: User;

  @Field(() => [User], { nullable: true })
  students: User[];
}

@ObjectType()
export class AddStudentsResponse {
  @Field(() => String)
  message: string;
}
