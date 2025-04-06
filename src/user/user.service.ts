import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddAchievementInput,
  AddWorkExperienceInput,
  CreateUserInput,
  UpdateAchievementIuput,
  UpdatePersonalInformationInput,
  UpdateWorkAndEducationInput,
  UpdateWorkExperienceInput,
} from './dto/create-user-input';
import { hashData } from 'src/utils';
import {
  Gender,
  Role,
  UpdateOneAchievementInput,
  UpdateOneWorkExperienceInput,
} from './entities/user.entity';
import { WorkExperience } from 'src/auth/dto/sign-up.dto';

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
        include: {
          achievements: true,
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

  async getUserProfile(uid: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          uid: uid,
        },
        include: {
          workExperiences: true,
          achievements: true,
        },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      return user;
    } catch (error) {
      throw new Error('Failed to fetch user.');
    }
  }

  async updatePersonalInformation(
    updatePersonalInformation: UpdatePersonalInformationInput,
  ) {
    const { uid, ...rest } = updatePersonalInformation;

    try {
      const user = await this.prismaService.user.update({
        where: { uid: uid },
        data: {
          ...rest,
          profileImg: updatePersonalInformation.profileImg,
        },
      });

      return user;
    } catch (error) {
      throw new Error('Failed to update user.');
    }
  }

  async updateWorkAndEducation(
    updateWorkAndEducation: UpdateWorkAndEducationInput,
  ) {
    const { uid, ...rest } = updateWorkAndEducation;

    try {
      const user = await this.prismaService.user.update({
        where: { uid: uid },
        data: {
          ...rest,
        },
      });

      return user;
    } catch (error) {
      throw new Error('Failed to update user.');
    }
  }

  async updateWorkExperience(workExperienceInput: UpdateWorkExperienceInput) {
    const { uid, workExperiences } = workExperienceInput;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { uid },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const transactions = workExperiences.map((experience) => {
        if (experience.uid) {
          return this.prismaService.workExperience.update({
            where: { uid: experience.uid },
            data: {
              company: experience.company,
              position: experience.position,
              startYear: experience.startYear,
              endYear: experience.endYear,
              description: experience.description,
            },
          });
        } else {
          return this.prismaService.workExperience.create({
            data: {
              teacherId: user.id,
              company: experience.company,
              position: experience.position,
              startYear: experience.startYear,
              endYear: experience.endYear,
              description: experience.description,
            },
          });
        }
      });

      const updatedExperiences =
        await this.prismaService.$transaction(transactions);

      console.log(updatedExperiences);
      console.log(user);

      return user;
    } catch (error) {
      throw new Error(`Failed to update work experiences: ${error.message}`);
    }
  }

  async updateAchievements(achievementInput: UpdateAchievementIuput) {
    const { uid, achievement } = achievementInput;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { uid },
        select: { id: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const transactions = achievement.map((achievement) => {
        if (achievement.uid) {
          return this.prismaService.achievement.update({
            where: { uid: achievement.uid },
            data: {
              title: achievement.title,
              description: achievement.description,
            },
          });
        } else {
          return this.prismaService.achievement.create({
            data: {
              studentId: user.id,
              title: achievement.title,
              description: achievement.description,
            },
          });
        }
      });

      const updatedAchievements =
        await this.prismaService.$transaction(transactions);

      return updatedAchievements;
    } catch (error) {
      throw new Error(`Failed to update achievements: ${error.message}`);
    }
  }

  async updateInstructorWorkExperience(
    workExperienceUid: string,
    workExperience: WorkExperience,
  ) {
    try {
      const updatedWorkExperience =
        await this.prismaService.workExperience.update({
          where: { uid: workExperienceUid },
          data: {
            company: workExperience.company,
            position: workExperience.position,
            startYear: workExperience.startYear,
            endYear: workExperience.endYear,
            description: workExperience.description,
          },
        });

      return updatedWorkExperience;
    } catch (error) {
      throw new Error('Failed to update work experience.');
    }
  }

  async getInstructorWorkExperrience(uid: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { uid },
        include: {
          workExperiences: true,
        },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      return user.workExperiences;
    } catch (error) {
      throw new Error('Failed to fetch work experiences.');
    }
  }

  async getWorkExperience(workExperienceUid: string) {
    try {
      const workExperience = await this.prismaService.workExperience.findUnique(
        {
          where: { uid: workExperienceUid },
        },
      );

      if (!workExperience) {
        throw new Error('Work experience not found.');
      }

      return workExperience;
    } catch (error) {
      throw new Error('Failed to fetch work experience.');
    }
  }

  async updateOneWorkExperience(workExperience: UpdateOneWorkExperienceInput) {
    try {
      const updatedWorkExperience =
        await this.prismaService.workExperience.update({
          where: { uid: workExperience.uid },
          data: {
            company: workExperience.company,
            position: workExperience.position,
            startYear: workExperience.startYear,
            endYear: workExperience.endYear,
            description: workExperience.description,
          },
        });

      return updatedWorkExperience;
    } catch (error) {
      throw new Error('Failed to update work experience.');
    }
  }

  async addWorkExperience(workExperience: AddWorkExperienceInput) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { uid: workExperience.userUid },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newWorkExperience = await this.prismaService.workExperience.create({
        data: {
          teacherId: user.id,
          company: workExperience.company,
          position: workExperience.position,
          startYear: workExperience.startYear,
          endYear: workExperience.endYear,
          description: workExperience.description,
        },
      });

      return newWorkExperience;
    } catch (error) {
      throw new Error(`Failed to add work experience: ${error.message}`);
    }
  }

  async addAchievment(achievment: AddAchievementInput) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { uid: achievment.userUid },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newAchievment = await this.prismaService.achievement.create({
        data: {
          studentId: user.id,
          title: achievment.title,
          dateEarned: achievment.dateEarned,
          description: achievment.description,
        },
      });

      return newAchievment;
    } catch (error) {
      throw new Error(`Failed to add work experience: ${error.message}`);
    }
  }

  async getAchievements(userUid: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { uid: userUid },
        include: { achievements: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user.achievements;
    } catch (error) {
      throw new Error(`Failed to fetch achievements: ${error.message}`);
    }
  }

  async updateOneAchievement(updateData: UpdateOneAchievementInput) {
    try {
      const updatedAchievement = await this.prismaService.achievement.update({
        where: { uid: updateData.uid },
        data: {
          title: updateData.title,
          dateEarned: updateData.dateEarned,
          description: updateData.description,
        },
      });

      return updatedAchievement;
    } catch (error) {
      throw new Error(`Failed to update achievement: ${error.message}`);
    }
  }

  async getAchievement(achievementUid: string) {
    try {
      const achievement = await this.prismaService.achievement.findUnique({
        where: { uid: achievementUid },
      });

      if (!achievement) {
        throw new Error('Achievement not found');
      }

      return achievement;
    } catch (error) {
      throw new Error(`Failed to fetch achievement: ${error.message}`);
    }
  }
}
