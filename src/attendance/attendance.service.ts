import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userUid: string, classroomUid: string, subjectUid: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        uid: userUid,
      },
    });

    const classroom = await this.prismaService.classroom.findUnique({
      where: {
        uid: classroomUid,
      },
    });

    const subject = await this.prismaService.subject.findUnique({
      where: {
        uid: subjectUid,
      },
    });

    const attendance = await this.prismaService.attendance.create({
      data: {
        userId: user.id,
        subjectId: subject.id,
        classroomId: classroom.id,
      },
    });

    return attendance;
  }

  async getAttendanceByClassAndSubject(
    classroomUid: string,
    subjectUid: string,
  ) {
    const classroom = await this.prismaService.classroom.findUnique({
      where: {
        uid: classroomUid,
      },
    });

    const subject = await this.prismaService.subject.findUnique({
      where: {
        uid: subjectUid,
      },
    });

    const attendances = await this.prismaService.attendance.findMany({
      where: {
        classroomId: classroom.id,
        subjectId: subject.id,
      },
    });

    return attendances;
  }

  async getAttendanceByStudent(userUid: string, classroomUid: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        uid: userUid,
      },
    });

    const classroom = await this.prismaService.classroom.findUnique({
      where: {
        uid: classroomUid,
      },
    });

    const attendance = await this.prismaService.attendance.findMany({
      where: {
        classroomId: classroom.id,
        userId: user.id,
      },
    });

    return attendance;
  }
}
