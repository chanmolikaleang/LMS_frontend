import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClassroomService } from './classroom.service';
import { AddStudentsResponse, Classroom } from './entitys/classroom.entity';
import {
  AddStudentToClassroomInput,
  CreateClassroomInput,
} from './dto/create-classroom.input';

@Resolver()
export class ClassroomResolver {
  constructor(private readonly classService: ClassroomService) {}

  @Mutation(() => Classroom, { name: 'createClassroom' })
  async create(
    @Args('createClassroomInput') createClassroomInput: CreateClassroomInput,
  ) {
    return await this.classService.create(createClassroomInput);
  }

  @Query(() => [Classroom], { name: 'getClassrooms' })
  async findAll() {
    return await this.classService.findAll();
  }

  @Query(() => Classroom, { name: 'getClassroomDetail' })
  async findOne(@Args('classUid') uid: string) {
    return await this.classService.findOne(uid);
  }

  @Mutation(() => AddStudentsResponse, { name: 'addStudendToClass' })
  async addStudendToClass(
    @Args('AddStudendToClassInput')
    addStudendToClassInput: AddStudentToClassroomInput,
  ) {
    return await this.classService.addStudentsToClass(addStudendToClassInput);
  }
}
