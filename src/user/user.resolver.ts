import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user-input';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/role/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/role/roles.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { name: 'createTeacher' })
  async createTeacher(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return await this.userService.createTeacher(createUserInput);
  }

  @Mutation(() => User, { name: 'createStudent' })
  async createstudent(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return await this.userService.createStudent(createUserInput);
  }

  @Query(() => User, { name: 'getUser' })
  async findOne(@Args('uid') uid: string) {
    return await this.userService.findOne(uid);
  }

  @Query(() => [User], { name: 'getUsers' })
  @UseGuards(RolesGuard)
  @Roles(Role.Teacher, Role.Admin)
  // @Roles(Role.Admin)
  async findAll() {
    return await this.userService.findAll();
  }

  @Query(() => [User], { name: 'getStudents' })
  // @UseGuards(RolesGuard)
  // @Roles(Role.Teacher, Role.Admin)
  // @Roles(Role.Admin)
  async getStudents() {
    return await this.userService.getStudents();
  }

  @Query(() => [User], { name: 'getTeachers' })
  // @UseGuards(RolesGuard)
  // @Roles(Role.Teacher, Role.Admin)
  // @Roles(Role.Admin)
  async getTeachers() {
    return await this.userService.getTeachers();
  }
}
