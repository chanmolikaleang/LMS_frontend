import { Field, ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classroom/entitys/classroom.entity';
import { Subject } from 'src/subject/entity/subject.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Attendance {
  @Field()
  uid: string;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Subject, { nullable: true })
  subject: Subject;

  @Field(() => Classroom, { nullable: true })
  classroom: Classroom;
}
