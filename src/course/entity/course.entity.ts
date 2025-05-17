import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Quiz } from 'src/quiz/entity/quiz.entity';
import { User } from 'src/user/entities/user.entity';

export enum CourseStatus {
  Draft = 'Draft',
  Public = 'Public',
  Deleted = 'Deleted',
}

export enum CourseType {
  Free = 'Free',
  Paid = 'Paid',
}

@ObjectType()
export class Category {
  @Field({ nullable: true })
  uid: string;

  @Field({ nullable: true })
  name: string;
}

@ObjectType()
export class CourseProgress {
  @Field({ nullable: true })
  uid: string;

  @Field({ nullable: true })
  percentage: number;
}

@ObjectType()
export class Review {
  @Field()
  uid: string;

  @Field(() => User, { nullable: true })
  student: User;

  @Field()
  rating: number;

  @Field({ nullable: true })
  comment: string;
}

@ObjectType()
export class Course {
  @Field()
  uid: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  describtion: string;

  @Field({ nullable: true })
  price: string;

  @Field({ nullable: true })
  status: CourseStatus;

  @Field({ nullable: true })
  type: CourseType;

  @Field(() => [Material])
  material: Material[];

  @Field(() => [User], { nullable: true })
  student: User[];

  @Field(() => [User], { nullable: true })
  instructor: User[];

  @Field(() => [Progress], { nullable: true })
  progress: Progress[];

  @Field(() => [CourseProgress], { nullable: true })
  courseProgress: CourseProgress[];

  @Field({ nullable: true })
  coverImageUrl: string;

  @Field({ nullable: true })
  avgRating: number;

  @Field(() => [Review], { nullable: true })
  Review: Review;

  @Field(() => [Category], { nullable: true })
  categories: Category;

  @Field({ nullable: true })
  level: string;

  @Field(() => [Quiz], { nullable: true })
  Quiz: Quiz[];

  @Field({ nullable: true })
  createdAt: Date;
}

@ObjectType()
export class CourseForTeacherPage {
  @Field()
  uid: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  describtion: string;

  @Field({ nullable: true })
  price: string;

  @Field({ nullable: true })
  status: CourseStatus;

  @Field({ nullable: true })
  type: CourseType;

  @Field(() => [Material])
  material: Material[];

  // @Field(() => [User], { nullable: true })
  // student: User[];

  @Field(() => [User], { nullable: true })
  instructor: User[];

  @Field(() => [Progress], { nullable: true })
  progress: Progress[];

  @Field(() => [CourseProgress], { nullable: true })
  courseProgress: CourseProgress[];

  @Field({ nullable: true })
  coverImageUrl: string;

  @Field({ nullable: true })
  avgRating: number;

  @Field(() => [Review], { nullable: true })
  Review: Review;

  @Field(() => [Category], { nullable: true })
  categories: Category;

  @Field({ nullable: true })
  level: string;

  @Field(() => [Quiz], { nullable: true })
  Quiz: Quiz[];

  @Field(() => [StudentWithProgress], { nullable: true })
  student: StudentWithProgress[];
}

@ObjectType()
export class StudentWithProgress {
  @Field(() => User)
  user: User;

  @Field(() => [Progress], { nullable: true })
  progress?: Progress[];

  @Field(() => [CourseProgress], { nullable: true })
  courseProgress?: CourseProgress[];
}

@ObjectType()
export class CourseWithProgress {
  @Field()
  uid: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  describtion: string;

  @Field({ nullable: true })
  price: string;

  @Field({ nullable: true })
  status: CourseStatus;

  @Field({ nullable: true })
  type: CourseType;

  @Field(() => [MaterialWithProgress])
  material: MaterialWithProgress[];

  @Field(() => [User], { nullable: true })
  student: User[];

  @Field(() => [User], { nullable: true })
  instructor: User[];

  @Field(() => [Progress], { nullable: true })
  progress: Progress[];

  @Field(() => [StudentProgress], { nullable: true })
  studentProgress?: StudentProgress[];

  @Field(() => CourseProgress, { nullable: true })
  courseProgress: CourseProgress;

  @Field({ nullable: true })
  coverImageUrl: string;

  @Field(() => [Review], { nullable: true })
  Review: Review;

  @Field({ nullable: true })
  avgRating: number;

  @Field(() => [Category], { nullable: true })
  categories: Category;

  @Field({ nullable: true })
  level: string;

  @Field(() => [Quiz], { nullable: true })
  Quiz: Quiz;

  @Field({ nullable: true })
  createdAt: Date;
}

@ObjectType()
export class MaterialWithProgress {
  @Field()
  uid: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  describtion: string;

  @Field({ nullable: true })
  video_url: string;

  @Field({ nullable: true })
  ppt_url: string;

  @Field({ nullable: true })
  percentage: number;

  @Field({ nullable: true })
  completed: boolean;
}

@ObjectType()
export class StudentProgress {
  @Field()
  percentage: number;

  @Field()
  completed: boolean;
}

@ObjectType()
export class Material {
  @Field()
  uid: string;

  @Field()
  title: string;

  @Field()
  describtion: string;

  @Field({ nullable: true })
  video_url: string;

  @Field({ nullable: true })
  ppt_url: string;
}

@ObjectType()
export class EnrollmentResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class Progress {
  @Field({ nullable: true })
  uid: string;

  @Field({ nullable: true })
  percentage: number;
}

@ObjectType()
export class DeleteCourseResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class updateVideoProgressResponse {
  @Field()
  message: string;
}

registerEnumType(CourseStatus, { name: 'CourseStatus' });
registerEnumType(CourseType, { name: 'CourseType' });
