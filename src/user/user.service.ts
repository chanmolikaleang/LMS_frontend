import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user-input';
import { hashData } from 'src/utils';
import { Gender, Role } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTeacher(createUserInput: CreateUserInput) {
    const { password, gender, ...rest } = createUserInput;

    const hashed = await hashData(password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          ...rest,
          hashed,
          role: Role.Teacher,
          gender: gender as Gender,
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', {
        message: error.message,
        stack: error.stack,
        details: error,
      });
      throw new ConflictException('Failed to create user');
    }
  }

  async createStudent(createUserInput: CreateUserInput) {
    const { password, gender, ...rest } = createUserInput;

    const hashed = await hashData(password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          ...rest,
          hashed,
          role: Role.Student,
          gender: gender as Gender,
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', {
        message: error.message,
        stack: error.stack,
        details: error,
      });
      throw new ConflictException('Failed to create user');
    }
  }

  async findOne(uid: string) {
    const user = await this.prismaService.user.findUnique({
      where: { uid: uid },
    });

    if (!user) {
      throw new Error(`User with UID ${uid} does not exist.`);
    }
    console.log(user);
    return user;
  }

  async findAll() {
    try {
      const users = await this.prismaService.user.findMany({
        // include: {
        //   classroom: true,
        // },
      });

      if (users.length === 0) {
        throw new Error('No users found.');
      }

      return users;
    } catch (error) {
      throw new Error('Failed to fetch users.');
    }
  }

  async getTeachers() {
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          role: Role.Teacher,
        },
        include: {
          Subject: true,
        },
      });

      if (users.length === 0) {
        throw new Error('No users found.');
      }

      return users;
    } catch (error) {
      throw new Error('Failed to fetch users.');
    }
  }

  async getStudents() {
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          role: Role.Student,
        },
      });

      if (users.length === 0) {
        throw new Error('No users found.');
      }

      return users;
    } catch (error) {
      throw new Error('Failed to fetch users.');
    }
  }
}
