import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SummaryDto {
  @Field(() => Int)
  studentCount: number;

  @Field(() => Int)
  instructorCount: number;

  @Field(() => Int)
  courseCount: number;

  @Field(() => Int)
  categoryCount: number;
}

@ObjectType()
export class RoleDistributionDto {
  @Field()
  role: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class CoursesPerCategoryDto {
  @Field()
  category: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class MonthlyTrendDto {
  @Field()
  month: string; // format: YYYY-MM

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class ChartDataDto {
  @Field(() => [RoleDistributionDto])
  roleDistribution: RoleDistributionDto[];

  @Field(() => [CoursesPerCategoryDto])
  coursesPerCategory: CoursesPerCategoryDto[];

  @Field(() => [MonthlyTrendDto])
  courseTrend: MonthlyTrendDto[];

  @Field(() => [MonthlyTrendDto])
  studentSignupTrend: MonthlyTrendDto[];
}

@ObjectType()
export class AdminDashboardDto {
  @Field(() => SummaryDto)
  summary: SummaryDto;

  @Field(() => ChartDataDto)
  charts: ChartDataDto;
}
