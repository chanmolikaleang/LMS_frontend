import { Field, InputType } from '@nestjs/graphql';
import { CourseStatus, CourseType } from '../entity/course.entity';

@InputType()
export class CreateCourseInput {
  @Field()
  name: string;

  @Field()
  describtion: string;

  @Field({ nullable: true })
  price: string;

  @Field({ nullable: true })
  status: CourseStatus;

  @Field({ nullable: true })
  type: CourseType;

  @Field(() => [MaterialInput])
  material: MaterialInput[];

  @Field()
  instructorUid: string;

  @Field({ nullable: true })
  coverImageUrl: string;
}

@InputType()
export class MaterialInput {
  @Field()
  title: string;

  @Field()
  describtion: string;

  @Field()
  video_url: string;
}

@InputType()
export class CourseEnrollmentInput {
  @Field()
  courseUid: string;

  @Field()
  studentUid: string;
}
