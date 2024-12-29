import { Field, InputType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class CreateClassroomInput {
  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  year: string;

  // @Field(() => [String], { nullable: true })
  // teacherUid: [string];

  @Field()
  teacherUid: string;

  @Field(() => [String], { nullable: true })
  studentUids: [string];
}

@InputType()
export class AddStudentToClassroomInput {
  @Field()
  classroomUid: string;

  @Field(() => [String], { nullable: true })
  studentUids: [string];
}
