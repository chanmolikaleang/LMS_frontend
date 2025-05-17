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
import { Role } from 'src/user/entities/user.entity';
import {
  CourseStudentStat,
  InstructorDashboardStats,
} from './entity/instructorDashboard.dto';
import { SubmitQuizInput } from 'src/quiz/dto/create-quiz.input';

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
      quiz,
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
            ppt_url: mat.ppt_url,
          })),
        },

        Quiz: {
          create: {
            title: quiz.title,
            questions: {
              create: quiz.questions.map((question) => ({
                text: question.text,
                options: question.options,
                correctAnswerIndex: question.correctAnswerIndex,
                score: question.score,
              })),
            },
          },
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
        Quiz: {
          include: {
            questions: true,
            results: true,
            course: true,
          },
        },
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
        Quiz: {
          include: {
            questions: true,
            results: true,
            course: true,
          },
        },
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
        Quiz: {
          include: {
            questions: true,
            results: true,
            course: true,
          },
        },
      },
    });
    return course;
  }

  async getCourseForTeacher(courseUid: string) {
    const course = await this.prismaService.course.findUnique({
      where: {
        uid: courseUid,
      },
      include: {
        instructor: true,
        material: true,
        categories: true,
        Review: {
          include: {
            student: true,
          },
        },
        Quiz: {
          include: {
            questions: true,
            results: true,
          },
        },
        student: {
          include: {
            CourseProgress: {
              where: {
                course: {
                  uid: courseUid,
                },
              },
            },
            Progress: {
              where: {
                course: {
                  uid: courseUid,
                },
              },
              include: {
                material: true,
              },
            },
          },
        },
      },
    });

    // Transform student[] into StudentWithProgress[]
    const studentWithProgress = course.student.map((user) => ({
      user,
      progress: user.Progress,
      courseProgress: user.CourseProgress,
    }));

    return {
      ...course,
      student: studentWithProgress,
    };
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
        Quiz: {
          include: {
            questions: true,
            results: true,
            course: true,
          },
        },
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

  async getStudentRecommendCourses(studentUid: string) {
    const student = await this.prismaService.user.findUnique({
      where: { uid: studentUid },
      include: { interestedCategories: true },
    });

    const interestedCategoryUids =
      student?.interestedCategories?.map((c) => c.uid) || [];

    const enrolledCourses = await this.prismaService.course.findMany({
      where: {
        student: { some: { uid: studentUid } },
        status: CourseStatus.Public,
      },
      include: { categories: true },
    });

    const enrolledCategoryUids = [
      ...new Set(
        enrolledCourses.flatMap((course) =>
          course.categories.map((c) => c.uid),
        ),
      ),
    ];

    // Run all queries in parallel
    const [interestCourses, enrolledCategoryCourses, randomCourses] =
      await Promise.all([
        this.prismaService.course.findMany({
          where: {
            categories: { some: { uid: { in: interestedCategoryUids } } },
            status: CourseStatus.Public,
          },
          include: {
            instructor: true,
            material: true,
            Progress: true,
            Review: { include: { student: true } },
            categories: true,
            CourseProgress: true,
          },
        }),
        this.prismaService.course.findMany({
          where: {
            categories: { some: { uid: { in: enrolledCategoryUids } } },
            status: CourseStatus.Public,
          },
          include: {
            instructor: true,
            material: true,
            Progress: true,
            Review: { include: { student: true } },
            categories: true,
            CourseProgress: true,
          },
        }),
        this.prismaService.course.findMany({
          where: { status: CourseStatus.Public },
          include: {
            instructor: true,
            material: true,
            Progress: true,
            Review: { include: { student: true } },
            categories: true,
            CourseProgress: true,
          },
          take: 10,
        }),
      ]);

    const courseMap = new Map<string, { course: any; score: number }>();

    const addCoursesWithScore = (courses: any[], score: number) => {
      for (const course of courses) {
        if (
          !courseMap.has(course.uid) ||
          courseMap.get(course.uid)!.score < score
        ) {
          courseMap.set(course.uid, { course, score });
        }
      }
    };

    addCoursesWithScore(randomCourses, 1);
    addCoursesWithScore(enrolledCategoryCourses, 2);
    addCoursesWithScore(interestCourses, 3);

    const sortedCourses = Array.from(courseMap.values())
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.course);

    return sortedCourses;
  }

  async getAdminDashboardData() {
    const [
      studentCount,
      instructorCount,
      courseCount,
      categoryCount,
      roleCounts,
      coursesPerCategory,
      courseTrendRaw,
      studentSignupTrendRaw,
    ] = await Promise.all([
      this.prismaService.user.count({ where: { role: Role.Student } }),
      this.prismaService.user.count({ where: { role: Role.Teacher } }),
      this.prismaService.course.count(),
      this.prismaService.category.count(),

      // Pie chart data
      this.prismaService.user.groupBy({
        by: ['role'],
        _count: { uid: true },
      }),

      // Courses per category (bar)
      this.prismaService.category.findMany({
        include: {
          _count: {
            select: { courses: true },
          },
        },
      }),

      // Course trend
      this.prismaService.course.findMany({
        select: { createdAt: true },
      }),

      // Student signup trend
      this.prismaService.user.findMany({
        where: { role: 'Student' },
        select: { createdAt: true },
      }),
    ]);

    // Format line chart data (monthly counts)
    const groupByMonth = (items: { createdAt: Date }[]) => {
      const counts: Record<string, number> = {};
      items.forEach(({ createdAt }) => {
        const month = createdAt.toISOString().slice(0, 7); // 'YYYY-MM'
        counts[month] = (counts[month] || 0) + 1;
      });
      return Object.entries(counts).map(([month, count]) => ({ month, count }));
    };

    return {
      summary: {
        studentCount,
        instructorCount,
        courseCount,
        categoryCount,
      },
      charts: {
        roleDistribution: roleCounts.map((r) => ({
          role: r.role,
          count: r._count.uid,
        })),
        coursesPerCategory: coursesPerCategory.map((cat) => ({
          category: cat.name,
          count: cat._count.courses,
        })),
        courseTrend: groupByMonth(courseTrendRaw),
        studentSignupTrend: groupByMonth(studentSignupTrendRaw),
      },
    };
  }

  async getInstructorDashboard(uid: string): Promise<InstructorDashboardStats> {
    const instructor = await this.prismaService.user.findUnique({
      where: { uid },
      include: {
        instructorOf: {
          include: {
            student: true,
            Review: true,
          },
        },
      },
    });

    // Calculate the total courses
    const totalCourses = instructor.instructorOf.length;

    // Calculate the total students (unique set of students per course)
    const totalStudents = new Set(
      instructor.instructorOf.flatMap((course) =>
        course.student.map((s) => s.uid),
      ),
    ).size;

    // Calculate average course rating
    const allRatings = instructor.instructorOf.flatMap((course) =>
      course.Review.map((r) => r.rating),
    );
    const averageRating = allRatings.length
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      : 0;

    // Calculate students per course
    const studentPerCourse: CourseStudentStat[] = instructor.instructorOf.map(
      (course) => ({
        courseName: course.name,
        studentCount: course.student.length,
      }),
    );

    return {
      totalCourses,
      totalStudents,
      averageRating: parseFloat(averageRating.toFixed(2)),
      studentPerCourse,
    };
  }

  async getQuiz(uid: string) {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { uid },
      include: {
        questions: true,
        results: true,
        course: true,
      },
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return quiz;
  }

  async submitQuiz(input: SubmitQuizInput) {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { uid: input.quizUid },
      include: { questions: true },
    });

    if (!quiz) throw new Error('Quiz not found');

    let totalScore = 0;
    let obtainedScore = 0;

    const answerDetails = quiz.questions.map((question) => {
      const answer = input.answers.find((a) => a.questionId === question.uid);
      const isCorrect = answer?.selectedIndex === question.correctAnswerIndex;
      totalScore += question.score;
      if (isCorrect) {
        obtainedScore += question.score;
      }

      return {
        questionId: question.uid,
        selectedIndex: answer?.selectedIndex ?? -1,
        correctAnswerIndex: question.correctAnswerIndex,
        isCorrect,
        score: question.score,
      };
    });

    await this.prismaService.quizResult.create({
      data: {
        quiz: { connect: { uid: quiz.uid } },
        student: { connect: { uid: input.studentUid } },
        totalScore,
        answers: JSON.parse(JSON.stringify(input.answers)), // Keep raw input in DB
      },
    });

    return {
      totalScore,
      obtainedScore,
      answerDetails,
    };
  }
}
