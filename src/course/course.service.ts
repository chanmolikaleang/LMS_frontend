import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CourseEnrollmentInput,
  CreateCourseInput,
} from './dto/create-course.input';
import { CourseStatus, CourseType } from './entity/course.entity';

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCourseInput: CreateCourseInput) {
    const {
      name,
      describtion,
      material,
      status,
      instructorUid,
      price,
      type,
      coverImageUrl,
    } = createCourseInput;

    const user = await this.prismaService.user.findUnique({
      where: {
        uid: instructorUid,
      },
    });

    const course = await this.prismaService.course.create({
      data: {
        coverImageUrl,
        name,
        price,
        type: type as CourseType,
        describtion,
        status: status as CourseStatus,
        material: {
          create: material.map((mat) => ({
            title: mat.title,
            describtion: mat.describtion,
            video_url: mat.video_url,
          })),
        },
        instructor: {
          connect: { uid: user.uid },
        },
      },
      include: {
        material: true,
        instructor: true,
        student: true,
      },
    });

    console.log(course);

    return course;
  }

  async findOne(courseUid: string) {
    const course = await this.prismaService.course.findUnique({
      where: { uid: courseUid },
      include: {
        material: true,
        instructor: true,
        student: true,
      },
    });

    return course;
  }

  async findAll() {
    const courses = await this.prismaService.course.findMany({
      include: {
        material: true,
        instructor: true,
        student: true,
      },
      orderBy: { id: 'desc' },
    });

    return courses;
  }

  async getInstructorCourses(instructorUid: string) {
    const courses = await this.prismaService.course.findMany({
      where: {
        instructor: {
          some: {
            uid: instructorUid,
          },
        },
      },
      orderBy: { id: 'desc' },
      include: {
        instructor: true,
        material: true,
        student: true,
      },
    });
    return courses;
  }

  async getCourse(courseUid: string) {
    const course = await this.prismaService.course.findUnique({
      where: {
        uid: courseUid,
      },
      include: {
        instructor: true,
        material: true,
      },
    });
    return course;
  }

  async CourseEnrollment(courseEnrollmentInput: CourseEnrollmentInput) {
    const { courseUid, studentUid } = courseEnrollmentInput;

    const course = await this.prismaService.course.findUnique({
      where: { uid: courseUid },
    });

    const student = await this.prismaService.user.findUnique({
      where: { uid: studentUid },
    });

    if (!course) {
      throw new Error('Cannot find this course');
    }

    await this.prismaService.course.update({
      where: { uid: courseUid },
      data: {
        student: { connect: { uid: studentUid } },
      },
    });

    // Record initial progress
    await this.prismaService.progress.create({
      data: {
        userId: student.id,
        courseId: course.id,
        percentage: 0,
      },
    });

    return {
      message: 'Student enrolled successfully and progress initialized',
    };
  }

  async getStudentCourses(studentUid: string) {
    const student = await this.prismaService.user.findUnique({
      where: {
        uid: studentUid,
      },
    });

    const courses = await this.prismaService.course.findMany({
      where: {
        student: {
          some: {
            uid: studentUid,
          },
        },
      },
      orderBy: { id: 'desc' },
      include: {
        instructor: true,
        material: true,
        Progress: true,
      },
    });
    return courses;
  }
}
