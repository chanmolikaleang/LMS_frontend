import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Subject } from 'src/subject/entity/subject.entity';

export enum Role {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

@ObjectType()
export class User {
  @Field()
  uid: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  role: Role;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  profileImg: string;

  @Field({ nullable: true })
  contact: string;

  @Field({ nullable: true })
  dateOfBirth: string;

  @Field({ nullable: true })
  gender: Gender;

  @Field({ nullable: true })
  Subject: Subject;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  school: string;

  @Field({ nullable: true })
  gradeLevel: string;

  @Field({ nullable: true })
  mojro: string;

  @Field({ nullable: true })
  qualification: string;

  @Field({ nullable: true })
  experienceYears: string;

  @Field({ nullable: true })
  specialization: string;

  @Field({ nullable: true })
  joinedAt: Date;

  @Field(() => [WorkExperience], { nullable: true })
  workExperiences: WorkExperience[];

  @Field(() => [Achievement], { nullable: true })
  achievements: Achievement[];
}

@ObjectType()
export class WorkExperience {
  @Field()
  uid: string;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  startYear: number;

  @Field({ nullable: true })
  endYear: number;

  @Field({ nullable: true })
  description: string;
}

@ObjectType()
export class Achievement {
  @Field()
  uid: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  dateEarned: string;
}

@InputType()
export class UpdateOneWorkExperienceInput {
  @Field()
  uid: string;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  startYear: number;

  @Field({ nullable: true })
  endYear: number;

  @Field({ nullable: true })
  description: string;
}
@InputType()
export class UpdateOneAchievementInput {
  @Field()
  uid: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  dateEarned: string;
}

registerEnumType(Role, { name: 'Role' });
registerEnumType(Gender, { name: 'Gender' });
