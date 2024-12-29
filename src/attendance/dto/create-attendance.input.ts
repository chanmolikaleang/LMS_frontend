import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAttendanceInput {
  @Field()
  userUid: string;

  @Field()
  subjectUid: string;

  @Field()
  classroomUid: string;
}
