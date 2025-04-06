import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CourseEnrollmentInput,
  CreateCourseInput,
  ReviewCourseInput,
} from './dto/create-course.input';
import { CourseStatus, CourseType } from './entity/course.entity';
import {
  UpdateCourseInput,
  UpdateReviewCourseInput,
} from './dto/update-course.input';

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
      categoryUid,
      level,
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
        categories: {
          connect: categoryUid.map((cat) => ({
            uid: cat,
          })),
        },
        level,
      },
      include: {
        material: true,
        instructor: true,
        student: true,
        categories: true,
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
        Review: {
          include: {
            student: true,
          },
        },
        categories: true,
        student: true,
      },
    });

    return course;
  }

  async findAll() {
    const courses = await this.prismaService.course.findMany({
      where: {
        status: {
          not: CourseStatus.Deleted,
        },
      },
      include: {
        material: true,
        instructor: true,
        student: true,
        Progress: true,
        Review: {
          include: {
            student: true,
          },
        },
        categories: true,
        CourseProgress: true,
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
        status: {
          not: CourseStatus.Deleted,
        },
      },
      orderBy: { id: 'desc' },
      include: {
        instructor: true,
        material: true,
        student: true,
        Progress: true,
        Review: {
          include: {
            student: true,
          },
        },
        categories: true,
        CourseProgress: true,
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
        Progress: true,
        CourseProgress: true,
        Review: {
          include: {
            student: true,
          },
        },
        categories: true,
      },
    });
    return course;
  }

  async CourseEnrollment(courseEnrollmentInput: CourseEnrollmentInput) {
    const { courseUid, studentUid } = courseEnrollmentInput;

    const course = await this.prismaService.course.findUnique({
      where: { uid: courseUid },
      include: { material: true }, // Fetch all course materials (videos)
    });

    const student = await this.prismaService.user.findUnique({
      where: { uid: studentUid },
    });

    if (!course || !student) {
      throw new Error('Course or student not found');
    }

    // Enroll the student in the course
    await this.prismaService.course.update({
      where: { uid: courseUid },
      data: { student: { connect: { uid: studentUid } } },
    });

    // Initialize progress for all materials in the course
    const progressRecords = course.material.map((material) => ({
      userId: student.id,
      courseId: course.id,
      materialId: material.id,
      percentage: 0, // No progress initially
      completed: false, // Not watched yet
    }));

    if (progressRecords.length > 0) {
      await this.prismaService.progress.createMany({ data: progressRecords });
    }

    // Initialize overall course progress
    await this.prismaService.courseProgress.create({
      data: {
        userId: student.id,
        courseId: course.id,
        percentage: 0, // Course progress starts at 0%
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
        status: {
          equals: CourseStatus.Public,
        },
      },
      orderBy: { id: 'desc' },
      include: {
        instructor: true,
        material: true,
        Progress: true,
        Review: {
          include: {
            student: true,
          },
        },
        categories: true,
        CourseProgress: true,
      },
    });
    return courses;
  }

  async updateVideoProgress(
    studentUid: string,
    materialUid: string,
    percentage: number,
  ) {
    const student = await this.prismaService.user.findUnique({
      where: { uid: studentUid },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const material = await this.prismaService.material.findUnique({
      where: { uid: materialUid },
    });

    if (!material) {
      throw new Error('Material not found');
    }

    const progress = await this.prismaService.progress.findFirst({
      where: {
        userId: student.id,
        materialId: material.id,
      },
    });

    if (!progress) {
      throw new Error('Progress record not found');
    }

    await this.prismaService.progress.update({
      where: { id: progress.id },
      data: {
        percentage: percentage,
        completed: percentage === 100, // Mark as completed when 100%
      },
    });

    // Update overall course progress
    const courseProgress = await this.calculateCourseProgress(
      student.id,
      progress.courseId,
    );

    return { message: 'Video progress updated', courseProgress };
  }

  // Helper function to calculate course progress
  async calculateCourseProgress(userId: bigint, courseId: bigint) {
    const materials = await this.prismaService.progress.findMany({
      where: { userId, courseId },
    });

    const completedMaterials = materials.filter((m) => m.completed).length;
    const totalMaterials = materials.length;

    const percentage =
      totalMaterials > 0 ? (completedMaterials / totalMaterials) * 100 : 0;

    await this.prismaService.courseProgress.updateMany({
      where: { userId, courseId },
      data: { percentage },
    });

    return percentage;
  }

  async getCourseWithProgress(courseUid: string, studentUid: string) {
    // Fetch the student
    const student = await this.prismaService.user.findUnique({
      where: { uid: studentUid },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Fetch the course details
    const course = await this.prismaService.course.findUnique({
      where: { uid: courseUid },
      include: {
        material: true,
        instructor: true,
        student: true,
        Review: {
          include: {
            student: true,
          },
        },
        categories: true,
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    // Fetch the student's progress for the course
    const progress = await this.prismaService.progress.findMany({
      where: {
        userId: student.id,
        courseId: course.id,
      },
    });

    // Fetch the overall course progress for the student
    const courseProgress = await this.prismaService.courseProgress.findFirst({
      where: {
        userId: student.id,
        courseId: course.id,
      },
    });

    return {
      ...course,
      material: course.material.map((material) => {
        const materialProgress = progress.find(
          (p) => p.materialId === material.id,
        );
        return {
          ...material,
          percentage: materialProgress?.percentage || 0,
          completed: materialProgress?.completed || false,
        };
      }),
      courseProgress,
    };
  }

  async deleteCourse(courseUid: string) {
    const course = await this.prismaService.course.update({
      where: { uid: courseUid },
      data: {
        status: CourseStatus.Deleted,
      },
    });

    return { message: 'Students added successfully' };
  }

  async updateCourse(updateCourseInput: UpdateCourseInput) {
    const {
      uid,
      name,
      describtion,
      material,
      status,
      instructorUid,
      price,
      type,
      coverImageUrl,
    } = updateCourseInput;

    const user = await this.prismaService.user.findUnique({
      where: {
        uid: instructorUid,
      },
    });

    const course = await this.prismaService.course.update({
      where: { uid: uid },
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

    return course;
  }

  async getAllCoursesWithStudentProgress(studentUid: string) {
    // Fetch the student
    const student = await this.prismaService.user.findUnique({
      where: { uid: studentUid },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Fetch all courses the student is enrolled in
    const courses = await this.prismaService.course.findMany({
      where: {
        student: {
          some: {
            uid: studentUid,
          },
        },
        status: {
          not: CourseStatus.Deleted,
        },
      },
      include: {
        material: true,
        instructor: true,
        student: true,
        CourseProgress: {
          where: { userId: student.id },
        },
        Progress: {
          where: { userId: student.id },
        },
        Review: {
          include: {
            student: true,
          },
        },
        categories: true,
      },
      orderBy: { id: 'desc' },
    });

    // Map courses to include overall course progress and material progress
    return courses.map((course) => ({
      ...course,
      material: course.material.map((material) => {
        const materialProgress = course.Progress.find(
          (p) => p.materialId === material.id,
        );
        return {
          ...material,
          percentage: materialProgress?.percentage || 0,
          completed: materialProgress?.completed || false,
        };
      }),
      courseProgress: course.CourseProgress[0],
      progress: course.Progress.map((progress) => ({
        uid: progress.uid,
        percentage: progress.percentage,
        completed: progress.completed,
      })),
    }));
  }

  async reviewCourse(reviewCourseInput: ReviewCourseInput) {
    const { studentUid, courseUid, comment, rating } = reviewCourseInput;

    const student = await this.prismaService.user.findUnique({
      where: { uid: studentUid },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const course = await this.prismaService.course.findUnique({
      where: { uid: courseUid },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const review = await this.prismaService.review.create({
      data: {
        userId: student.id,
        courseId: course.id,
        rating,
        comment,
      },
    });

    // **Update course rating after adding a review**
    await this.updateCourseRating(course.id);

    return review;
  }

  async updateReviewCourse(updateReviewCourseInput: UpdateReviewCourseInput) {
    const { uid, comment, rating } = updateReviewCourseInput;

    const review = await this.prismaService.review.findUnique({
      where: { uid },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    const updatedReview = await this.prismaService.review.update({
      where: { uid },
      data: { rating, comment },
    });

    // **Update course rating after updating a review**
    await this.updateCourseRating(review.courseId);

    return updatedReview;
  }

  async updateCourseRating(courseId: bigint) {
    const result = await this.prismaService.review.aggregate({
      _avg: { rating: true },
      where: { courseId },
    });

    await this.prismaService.course.update({
      where: { id: courseId },
      data: { avgRating: result._avg.rating || 0 },
    });
  }

  async deleteReview(uid: string) {
    const review = await this.prismaService.review.findUnique({
      where: { uid },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    await this.prismaService.review.delete({
      where: { uid },
    });

    await this.updateCourseRating(review.courseId);

    return { message: 'Review deleted successfully' };
  }

  async createCategory(name: string) {
    return this.prismaService.category.create({
      data: { name },
    });
  }

  async getCategories() {
    return await this.prismaService.category.findMany();
  }

  async assignCategoriesToCourse(courseUid: string, categoryUids: string[]) {
    const course = await this.prismaService.course.findUnique({
      where: { uid: courseUid },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    // Find categories by UIDs
    const categories = await this.prismaService.category.findMany({
      where: { uid: { in: categoryUids } },
    });

    if (categories.length !== categoryUids.length) {
      throw new Error('Some categories were not found');
    }

    // Link course with categories
    return this.prismaService.course.update({
      where: { uid: courseUid },
      data: {
        categories: {
          set: categories.map((cat) => ({ id: cat.id })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async getCoursesByCategory(categoryUid: string) {
    return this.prismaService.course.findMany({
      where: {
        categories: {
          some: { uid: categoryUid },
        },
      },
      include: { categories: true },
    });
  }
}
