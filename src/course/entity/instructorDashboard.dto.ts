import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InstructorDashboardStats {
  @Field(() => Int)
  totalCourses: number;

  @Field(() => Int)
  totalStudents: number;

  @Field(() => Float)
  averageRating: number;

  @Field(() => [CourseStudentStat])
  studentPerCourse: CourseStudentStat[];

  @Field(() => Float)
  totalIncome: number;
}

@ObjectType()
export class CourseStudentStat {
  @Field()
  courseName: string;

  @Field(() => Int)
  studentCount: number;
}

@ObjectType()
export class SimpleStudent {
  @Field()
  uid: string;

  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  profileImg?: string;
}

@ObjectType()
export class SimpleStudentForm {
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImg?: string | null;
}
