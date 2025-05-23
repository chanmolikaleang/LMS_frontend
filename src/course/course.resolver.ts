import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseService } from './course.service';
import {
  Category,
  Course,
  CourseForTeacherPage,
  CourseWithProgress,
  DeleteCourseResponse,
  EnrollmentResponse,
  Review,
  updateVideoProgressResponse,
} from './entity/course.entity';
import {
  CourseEnrollmentInput,
  CreateCategoryInput,
  CreateCourseInput,
  ReviewCourseInput,
} from './dto/create-course.input';
import {
  UpdateCourseInput,
  UpdateReviewCourseInput,
} from './dto/update-course.input';
import { ADDRCONFIG } from 'dns';
import { waitForDebugger } from 'inspector';
import { AdminDashboardDto } from './entity/dashboard.dto';
import {
  InstructorDashboardStats,
  SimpleStudent,
} from './entity/instructorDashboard.dto';
import { GetCurrentUser } from 'src/common/decorators';
import {
  Quiz,
  QuizResult,
  SubmitQuizResult,
} from 'src/quiz/entity/quiz.entity';
import { SubmitQuizInput } from 'src/quiz/dto/create-quiz.input';

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

  @Query(() => [Course], { name: 'getStudentRecommendCourses' })
  async getStudentRecommendCourses(@Args('studentUid') studentUid: string) {
    return await this.courseService.getStudentRecommendCourses(studentUid);
  }

  @Query(() => Course, { name: 'getCourse' })
  async getCourses(@Args('courseUid') courseUid: string) {
    return await this.courseService.getCourse(courseUid);
  }

  @Query(() => CourseForTeacherPage, { name: 'getCourseForTeacher' })
  async getCourseForTeacher(@Args('courseUid') courseUid: string) {
    return await this.courseService.getCourseForTeacher(courseUid);
  }

  @Mutation(() => EnrollmentResponse, { name: 'courseEnrrolment' })
  async addStudendToClass(
    @Args('CourseEnrollmentInput')
    courseEnrollmentInput: CourseEnrollmentInput,
  ) {
    return await this.courseService.CourseEnrollment(courseEnrollmentInput);
  }

  @Mutation(() => DeleteCourseResponse, { name: 'deleteCourse' })
  async deleteCourse(@Args('courseUid') courseUid: string) {
    return await this.courseService.deleteCourse(courseUid);
  }

  @Mutation(() => Course, { name: 'updateCourse' })
  async updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return await this.courseService.updateCourse(updateCourseInput);
  }

  @Mutation(() => updateVideoProgressResponse, { name: 'updateVideoProgress' })
  async updateVideoProgress(
    @Args('materialUid') materialUid: string,
    @Args('studentUid') studentUid: string,
    @Args('percentage') percentage: number,
  ) {
    return await this.courseService.updateVideoProgress(
      studentUid,
      materialUid,
      percentage,
    );
  }

  @Query(() => CourseWithProgress, { name: 'getCourseWithProgress' })
  async getCourseWithProgress(
    @Args('courseUid') courseUid: string,
    @Args('studentUid') studentUid: string,
  ) {
    return await this.courseService.getCourseWithProgress(
      courseUid,
      studentUid,
    );
  }

  @Query(() => [CourseWithProgress], { name: 'getAllCourseWithProgress' })
  async getAllCourseWithProgress(@Args('studentUid') studentUid: string) {
    return await this.courseService.getAllCoursesWithStudentProgress(
      studentUid,
    );
  }

  @Mutation(() => Review, { name: 'reviewCourse' })
  async reviewCourse(
    @Args('reviewCourseInput') reviewCourseInput: ReviewCourseInput,
  ) {
    return await this.courseService.reviewCourse(reviewCourseInput);
  }

  @Mutation(() => Review, { name: 'updateReviewCourse' })
  async updateReviewCourse(
    @Args('updateReviewCourse')
    updateReviewCourseInput: UpdateReviewCourseInput,
  ) {
    return await this.courseService.updateReviewCourse(updateReviewCourseInput);
  }

  @Mutation(() => DeleteCourseResponse, { name: 'deleteReviewCourse' })
  async deleteReviewCourse(@Args('deleteReviewCourse') uid: string) {
    return await this.courseService.deleteReview(uid);
  }

  @Mutation(() => Category, { name: 'createCategory' })
  async createCategory(@Args('name') name: string) {
    return await this.courseService.createCategory(name);
  }

  @Mutation(() => Course, { name: 'assignCategoriesToCourse' })
  async assignCategoriesToCourse(
    @Args('courseUid', { type: () => String }) courseUid: string,
    @Args('categoryUids', { type: () => [String] }) categoryUids: string[],
  ) {
    return await this.courseService.assignCategoriesToCourse(
      courseUid,
      categoryUids,
    );
  }

  @Query(() => [Category], { name: 'getCategories' })
  async getCategories() {
    return await this.courseService.getCategories();
  }

  @Query(() => AdminDashboardDto, { name: 'getAdminDashboard' })
  getAdminDashboardData() {
    return this.courseService.getAdminDashboardData();
  }

  // @Query(() => InstructorDashboardStats)
  // async getInstructorDashboard(
  //   @GetCurrentUser() user: { uid: string },
  // ): Promise<InstructorDashboardStats> {
  //   return await this.courseService.getInstructorDashboard(user.uid);
  // }

  @Query(() => InstructorDashboardStats, { name: 'getTeacherDashboard' })
  async getInstructorDashboard(@Args('studentUid') studentUid: string) {
    return await this.courseService.getInstructorDashboard(studentUid);
  }

  @Query(() => Quiz, { name: 'getQuiz' })
  async getQuiz(@Args('quizUid') quizUid: string) {
    return await this.courseService.getQuiz(quizUid);
  }

  @Mutation(() => SubmitQuizResult, { name: 'submitQuiz' })
  async submitQuiz(@Args('submitQuizInput') input: SubmitQuizInput) {
    return this.courseService.submitQuiz(input);
  }

  @Query(() => [SimpleStudent], { name: 'getStudentofInstructor' })
  async getUniqueEnrolledStudents(@Args('uid') uid: string) {
    return this.courseService.getUniqueEnrolledStudents(uid);
  }
}
