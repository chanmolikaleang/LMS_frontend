import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignUpDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  school: string;

  @Field()
  @IsString()
  gradeLevel: string;

  @Field()
  @IsString()
  major: string;

  @Field()
  @IsString()
  gender: string;

  @Field()
  @IsString()
  dateOfBirth: string;

  @Field()
  @IsString()
  contact: string;

  @Field()
  @IsString()
  profileImg: string;

  @Field(() => [String])
  interestedCategoriesUid: string[];
}

@InputType()
export class SignInDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@ObjectType()
export class SignUpResponse {
  @Field()
  uid: string;

  @Field()
  username: string;

  @Field()
  access_token: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  profileImg: string;
}

@ObjectType()
export class SignInResponse {
  @Field()
  uid: string;

  @Field()
  username: string;

  @Field()
  access_token: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  profileImg: string;
}

@InputType()
export class InstructorSignUpDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  qualification: string;

  @Field()
  @IsString()
  experienceYears: string;

  @Field()
  @IsString()
  specialization: string;

  @Field()
  @IsString()
  contact: string;

  @Field(() => [WorkExperience], { nullable: true })
  workExperiences: WorkExperience[];

  @Field(() => [Achievement], { nullable: true })
  achievement: Achievement[];

  @Field()
  @IsString()
  profileImg: string;
}

@InputType()
export class WorkExperience {
  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  startYear: number;

  @Field({ nullable: true })
  endYear: number;

  @Field()
  description: string;
}

@InputType()
export class Achievement {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  dateEarned: string;
}
