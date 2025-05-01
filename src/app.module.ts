import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { isValidToken } from './utils';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';
import { AppResolver } from './app.resolver';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { AtGuard } from './common/guards';
import { PermissionsGuard } from './common/guards/permission.guard';
import { ClassroomModule } from './classroom/classroom.module';
import { AttendanceService } from './attendance/attendance.service';
import { AttendanceResolver } from './attendance/attendance.resolver';
import { AttendanceModule } from './attendance/attendance.module';
import { SubjectService } from './subject/subject.service';
import { SubjectModule } from './subject/subject.module';
import { CourseModule } from './course/course.module';
import { PaymentModule } from './payment/payment.module';
import { WebhookController } from './payment/webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/gql/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      sortSchema: true,
      introspection: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    ClassroomModule,
    AttendanceModule,
    SubjectModule,
    CourseModule,
    PaymentModule,
  ],
  controllers: [AppController, WebhookController],
  // providers: [AppService, AppResolver],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AtGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    AppService,
    AttendanceService,
    AttendanceResolver,
    SubjectService,
  ],
})
export class AppModule {}
