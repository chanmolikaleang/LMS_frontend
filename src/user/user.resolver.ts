import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  Achievement,
  UpdateOneAchievementInput,
  UpdateOneWorkExperienceInput,
  User,
  WorkExperience,
} from './entities/user.entity';
import {
  AddAchievementInput,
  AddWorkExperienceInput,
  CreateUserInput,
  UpdateAchievementIuput,
  UpdatePersonalInformationInput,
  UpdateWorkAndEducationInput,
  UpdateWorkExperienceInput,
} from './dto/create-user-input';
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

  @Query(() => User, { name: 'getUserProfile' })
  async getUserProfile(@Args('uid') uid: string) {
    return await this.userService.getUserProfile(uid);
  }

  @Mutation(() => User, { name: 'updatePersonalInformation' })
  async updatePersonalInformation(
    @Args('updatePersonalInformationInput')
    updatePersonalInformationInput: UpdatePersonalInformationInput,
  ) {
    return await this.userService.updatePersonalInformation(
      updatePersonalInformationInput,
    );
  }

  @Mutation(() => User, { name: 'updateWorkAndEducation' })
  async updateWorkAndEducation(
    @Args('updateWorkAndEducationInput')
    updateWorkAndEducationInput: UpdateWorkAndEducationInput,
  ) {
    return await this.userService.updateWorkAndEducation(
      updateWorkAndEducationInput,
    );
  }

  @Mutation(() => User, { name: 'updateWorkExperience' })
  async updateWorkExperience(
    @Args('updateWorkExperienceInput')
    updateWorkExperienceInput: UpdateWorkExperienceInput,
  ) {
    return await this.userService.updateWorkExperience(
      updateWorkExperienceInput,
    );
  }

  @Mutation(() => User, { name: 'updateAchievement' })
  async updateAchievement(
    @Args('updateAchievementInput')
    updateAchievementInput: UpdateAchievementIuput,
  ) {
    return await this.userService.updateAchievements(updateAchievementInput);
  }

  @Query(() => WorkExperience, { name: 'getInstructorWorkExperrience' })
  async getInstructorWorkExperrience(@Args('uid') uid: string) {
    return await this.userService.getInstructorWorkExperrience(uid);
  }

  @Query(() => WorkExperience, { name: 'getWorkExperrience' })
  async getWorkExperrience(@Args('uid') uid: string) {
    return await this.userService.getWorkExperience(uid);
  }

  @Mutation(() => WorkExperience, { name: 'updateOneWorkExperience' })
  async updateOneWorkExperience(
    @Args('updateWorkExperienceInput')
    updateWorkOneExperienceInput: UpdateOneWorkExperienceInput,
  ) {
    return await this.userService.updateOneWorkExperience(
      updateWorkOneExperienceInput,
    );
  }

  @Mutation(() => WorkExperience, { name: 'AddWorkExperience' })
  async addWorkExperience(
    @Args('addWorkExperienceInput')
    addWorkExperienceInput: AddWorkExperienceInput,
  ) {
    return await this.userService.addWorkExperience(addWorkExperienceInput);
  }

  @Mutation(() => Achievement, { name: 'AddAchievement' })
  async addAchievement(
    @Args('addAchievementInput')
    addAchievementInput: AddAchievementInput,
  ) {
    return await this.userService.addAchievment(addAchievementInput);
  }

  @Query(() => Achievement, { name: 'getAchievement' })
  async getAchievement(@Args('uid') uid: string) {
    return await this.userService.getAchievement(uid);
  }

  @Mutation(() => Achievement, { name: 'updateOneAchievement' })
  async updateOneAchievement(
    @Args('updateAchievementInput')
    updateOneAchievementInput: UpdateOneAchievementInput,
  ) {
    return await this.userService.updateOneAchievement(
      updateOneAchievementInput,
    );
  }
}
