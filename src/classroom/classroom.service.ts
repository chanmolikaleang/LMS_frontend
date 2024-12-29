import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddStudentToClassroomInput,
  CreateClassroomInput,
} from './dto/create-classroom.input';

@Injectable()
export class ClassroomService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createClassroomInput: CreateClassroomInput) {
    const { code, name, teacherUid, studentUids, year } = createClassroomInput;

    const existingCode = await this.prismaService.classroom.findFirst({
      where: {
        code: code,
      },
    });

    const classroom = await this.prismaService.classroom.create({
      data: {
        name,
        code,
        year,
        teacher: {
          connect: { uid: teacherUid },
        },
        students: studentUids?.length
          ? {
              connect: studentUids.map((studentUid) => ({ uid: studentUid })),
            }
          : undefined,
      },
      include: {
        teacher: true,
        students: true,
      },
    });

    return classroom;
  }

  async findOne(classroomUid: string) {
    const classroom = await this.prismaService.classroom.findUnique({
      where: {
        uid: classroomUid,
      },
      include: {
        students: true,
        teacher: true,
      },
    });

    if (!classroom) {
      throw new Error('Cannot find this class');
    }

    return classroom;
  }

  async findAll() {
    const classrooms = await this.prismaService.classroom.findMany({
      include: {
        students: true,
        teacher: true,
      },
    });

    return classrooms;
  }

  async addStudentsToClass(
    addStudentsToClassInput: AddStudentToClassroomInput,
  ) {
    // Check if the classroom exists
    const { classroomUid, studentUids } = addStudentsToClassInput;
    const classroom = await this.prismaService.classroom.findUnique({
      where: {
        uid: classroomUid,
      },
    });

    if (!classroom) {
      throw new Error('Cannot find this class');
    }

    // Add the students to the class
    await this.prismaService.classroom.update({
      where: {
        uid: classroomUid,
      },
      data: {
        students: {
          connect: studentUids.map((studentUid) => ({ uid: studentUid })),
        },
      },
    });

    return { message: 'Students added successfully' };
  }
}
