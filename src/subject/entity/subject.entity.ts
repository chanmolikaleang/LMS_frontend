import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Subject {
  @Field()
  uid: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => [User], { nullable: true })
  teachers: User[];
}
