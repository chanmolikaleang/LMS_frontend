import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course, EnrollmentResponse } from './entity/course.entity';
import {
  CourseEnrollmentInput,
  CreateCourseInput,
} from './dto/create-course.input';

@Resolver()
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}
  @Mutation(() => Course, { name: 'createCourse' })
  async create(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    return await this.courseService.create(createCourseInput);
  }

  @Query(() => Course, { name: 'getCourse' })
  async findOne(@Args('courseUid') courseUid: string) {
    return await this.courseService.findOne(courseUid);
  }

  @Query(() => [Course], { name: 'getCourses' })
  async findAll() {
    return await this.courseService.findAll();
  }

  @Query(() => [Course], { name: 'getInstructorCourses' })
  async getInstructorCourses(@Args('instructorUid') instructorUid: string) {
    return await this.courseService.getInstructorCourses(instructorUid);
  }

  @Query(() => [Course], { name: 'getStudentCourses' })
  async getStudentCourses(@Args('studentUid') studentUid: string) {
    return await this.courseService.getStudentCourses(studentUid);
  }

  @Query(() => Course, { name: 'getCourse' })
  async getCourses(@Args('courseUid') courseUid: string) {
    return await this.courseService.getCourse(courseUid);
  }

  @Mutation(() => EnrollmentResponse, { name: 'courseEnrrolment' })
  async addStudendToClass(
    @Args('CourseEnrollmentInput')
    courseEnrollmentInput: CourseEnrollmentInput,
  ) {
    return await this.courseService.CourseEnrollment(courseEnrollmentInput);
  }
}
