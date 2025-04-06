import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { REQUEST } from '@nestjs/core';
import { PrismaClient, Role } from '@prisma/client';
import { getTokens, hashData } from 'src/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  InstructorSignUpDto,
  SignInDto,
  SignInResponse,
  SignUpDto,
  SignUpResponse,
} from './dto/sign-up.dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async register(signUp: SignUpDto): Promise<SignUpResponse> {
    // Retrieve tenantId from the request
    const tenantId = this.request['tenantId'];
    this.prisma = this.prismaService.getClient(tenantId);

    if (signUp.password !== signUp.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUp.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await hashData(signUp.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: signUp.email.toLowerCase(),
        username: signUp.username,
        firstName: signUp.firstname,
        lastName: signUp.lastname,
        hashed,
        role: Role.Student,
        address: signUp.address,
        school: signUp.school,
        gradeLevel: signUp.gradeLevel,
        major: signUp.major,
        contact: signUp.contact,
        profileImg: signUp.profileImg,
      },
    });

    const { username, email, role, uid, profileImg } = newUser;

    const access_token = await getTokens(
      newUser.uid,
      newUser.email,
      newUser.role,
    );

    return {
      uid,
      role,
      username,
      access_token,
      email,
      profileImg,
    };
  }

  async instructorRegister(
    signUp: InstructorSignUpDto,
  ): Promise<SignUpResponse> {
    // Retrieve tenantId from the request
    const tenantId = this.request['tenantId'];
    this.prisma = this.prismaService.getClient(tenantId);

    if (signUp.password !== signUp.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUp.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hashData(signUp.password);

    const newInstructor = await this.prisma.user.create({
      data: {
        email: signUp.email.toLowerCase(),
        username: signUp.username,
        firstName: signUp.firstname,
        lastName: signUp.lastname,
        hashed: hashedPassword,
        role: Role.Teacher,
        address: signUp.address,
        qualification: signUp.qualification,
        experienceYears: signUp.experienceYears,
        specialization: signUp.specialization,
        contact: signUp.contact,
        profileImg: signUp.profileImg,
      },
    });

    // Add Work Experiences if provided
    if (signUp.workExperiences && signUp.workExperiences.length > 0) {
      await this.prisma.workExperience.createMany({
        data: signUp.workExperiences.map((exp) => ({
          teacherId: newInstructor.id, // Link to instructor
          company: exp.company,
          position: exp.position,
          startYear: exp.startYear,
          endYear: exp.endYear || null,
          description: exp.description || null,
        })),
      });
    }

    if (signUp.achievement && signUp.achievement.length > 0) {
      await this.prisma.achievement.createMany({
        data: signUp.achievement.map((exp) => ({
          studentId: newInstructor.id,
          title: exp.title,
          description: exp.description,
          dateEarned: exp.dateEarned,
        })),
      });
    }

    // Generate Access Token
    const access_token = await getTokens(
      newInstructor.uid,
      newInstructor.email,
      newInstructor.role,
    );

    return {
      uid: newInstructor.uid,
      role: newInstructor.role,
      username: newInstructor.username,
      access_token,
      email: newInstructor.email,
      profileImg: newInstructor.profileImg,
    };
  }

  async login(signIn: SignInDto): Promise<SignInResponse> {
    const tenantId = this.request['tenantId'];
    this.prisma = this.prismaService.getClient(tenantId);

    // const organization = await this.organizationService.findFirst(tenantId);
    const user = await this.prisma.user.findUnique({
      where: {
        email: signIn.email,
      },
    });

    if (!user) throw new ForbiddenException('Incorrect Credentials');

    // const isMatched = await bcrypt.compare(signIn.password, user.hashed);
    // if (!isMatched) throw new ForbiddenException('Incorrect Credentials');

    // let role: string = '';
    const { uid, email, username, role, profileImg } = user;

    // if (user && user.role) role = user.role.roleName;

    // const userPermissions = await this.getUserPermissions(uid);

    const access_token = await getTokens(uid, email, role);
    return {
      uid,
      email,
      username,
      access_token,
      role,
      profileImg,
    };
  }
}
