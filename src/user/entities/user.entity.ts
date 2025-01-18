import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
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
}

registerEnumType(Role, { name: 'Role' });
registerEnumType(Gender, { name: 'Gender' });
