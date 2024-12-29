import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectInput } from './dto/create-subject.input';

@Injectable()
export class SubjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSubjectInput: CreateSubjectInput) {
    const { name, code } = createSubjectInput;

    const existingCode = await this.prismaService.subject.findFirst({
      where: {
        code: code,
      },
    });

    const subject = await this.prismaService.subject.create({
      data: {
        name,
        code,
      },
    });

    return subject;
  }

  async findOne(subjectUid: string) {
    const subject = await this.prismaService.subject.findUnique({
      where: {
        uid: subjectUid,
      },
    });

    return subject;
  }

  async findAll() {
    const subject = await this.prismaService.subject.findMany({
      include: {
        Teachers: true,
      },
    });

    return subject;
  }
}
