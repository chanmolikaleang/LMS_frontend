import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
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

  @Field({ nullable: true })
  coverImageUrl: string;
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
}

@ObjectType()
export class EnrollmentResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class Progress {
  @Field({ nullable: true })
  percentage: number;
}

registerEnumType(CourseStatus, { name: 'CourseStatus' });
registerEnumType(CourseType, { name: 'CourseType' });
