import { Field, InputType, Int } from '@nestjs/graphql';
// import { Role } from '@prisma/client';
import { Gender, Role } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  profileImg: string;

  @Field({ nullable: true })
  contact: string;

  @Field()
  gender: Gender;

  @Field()
  dateOfBirth: string;

  @Field(() => Role, { nullable: true })
  role: Role;
}

@InputType()
export class UpdatePersonalInformationInput {
  @Field()
  uid: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  gender: Gender;

  @Field()
  dateOfBirth: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  profileImg: string;

  @Field({ nullable: true })
  contact: string;

  @Field({ nullable: true })
  address: string;
}

@InputType()
export class UpdateWorkAndEducationInput {
  @Field()
  uid: string;

  @Field({ nullable: true })
  school: string;

  @Field({ nullable: true })
  gradeLevel: string;

  @Field({ nullable: true })
  major: string;

  @Field({ nullable: true })
  qualification: string;

  @Field({ nullable: true })
  experienceYears: string;

  @Field({ nullable: true })
  specialization: string;
}

@InputType()
export class UpdateWorkExperienceInput {
  @Field()
  uid: string;

  @Field(() => [UpdateWorkExperienceDetails])
  workExperiences: UpdateWorkExperienceDetails[];
}

@InputType()
export class UpdateWorkExperienceDetails {
  @Field({ nullable: true }) // Optional for new entries
  uid?: string;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  startYear: number;

  @Field({ nullable: true })
  endYear?: number;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateAchievementIuput {
  @Field()
  uid: string;

  @Field(() => [AchievementDetails], { nullable: true })
  achievement: AchievementDetails[];
}

@InputType()
export class AchievementDetails {
  @Field({ nullable: true }) // Optional for new entries
  uid?: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  dateEarned: string;
}

@InputType()
export class AddWorkExperienceInput {
  @Field()
  userUid: string;

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
export class AddAchievementInput {
  @Field()
  userUid: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  dateEarned: string;
}
