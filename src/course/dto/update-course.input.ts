import { Field, InputType, Int } from '@nestjs/graphql';
import { MaterialInput } from './create-course.input';
import { CourseStatus, CourseType } from '../entity/course.entity';
import { CreateQuizInput } from 'src/quiz/dto/create-quiz.input';

@InputType()
export class UpdateQuizInput {
  @Field()
  uid: string; // Allow quiz identification

  @Field()
  title: string;

  @Field(() => [UpdateQuestionInput])
  questions: UpdateQuestionInput[];
}

@InputType()
export class UpdateQuestionInput {
  @Field({ nullable: true })
  uid?: string; // optional, for existing questions

  @Field()
  text: string;

  @Field(() => [String])
  options: string[];

  @Field(() => Int)
  correctAnswerIndex: number;

  @Field(() => Int)
  score: number;
}
@InputType()
export class UpdateCourseInput {
  @Field()
  uid: string;

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

  @Field(() => UpdateQuizInput, { nullable: true })
  quiz: UpdateQuizInput;
}

@InputType()
export class DeleteCourseInput {
  @Field()
  courseUid: string;
}

@InputType()
export class UpdateReviewCourseInput {
  @Field()
  uid: string;

  @Field()
  rating: number;

  @Field({ nullable: true })
  comment: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field()
  uid: string;

  @Field()
  name: string;
}
