import { Field, InputType } from '@nestjs/graphql';
import { MaterialInput } from './create-course.input';
import { CourseStatus, CourseType } from '../entity/course.entity';

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
