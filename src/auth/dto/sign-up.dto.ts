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
}
