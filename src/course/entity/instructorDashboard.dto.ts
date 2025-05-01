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
}

@ObjectType()
export class CourseStudentStat {
  @Field()
  courseName: string;

  @Field(() => Int)
  studentCount: number;
}
