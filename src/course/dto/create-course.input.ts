import { Field, InputType } from '@nestjs/graphql';
import { CourseStatus, CourseType } from '../entity/course.entity';
import { CreateQuizInput } from 'src/quiz/dto/create-quiz.input';

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

  @Field(() => [String])
  categoryUid: string[];

  @Field(() => [String])
  docUrls: string[];

  @Field({ nullable: true })
  level: string;

  @Field(() => CreateQuizInput, { nullable: true })
  quiz: CreateQuizInput;
}

@InputType()
export class MaterialInput {
  @Field()
  title: string;

  @Field()
  describtion: string;

  @Field()
  video_url: string;

  @Field({ nullable: true })
  ppt_url: string;
}

@InputType()
export class CourseEnrollmentInput {
  @Field()
  courseUid: string;

  @Field()
  studentUid: string;
}

@InputType()
export class ReviewCourseInput {
  @Field()
  studentUid: string;

  @Field()
  courseUid: string;

  @Field({ nullable: true })
  rating: number;

  @Field({ nullable: true })
  comment: string;
}

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;
}
