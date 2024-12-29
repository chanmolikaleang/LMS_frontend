import { Module } from '@nestjs/common';
import { ClassroomResolver } from './classroom.resolver';
import { ClassroomService } from './classroom.service';

@Module({
  providers: [ClassroomResolver, ClassroomService]
})
export class ClassroomModule {}
