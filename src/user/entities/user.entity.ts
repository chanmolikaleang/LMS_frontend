import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Role {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student',
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
}

registerEnumType(Role, { name: 'Role' });
