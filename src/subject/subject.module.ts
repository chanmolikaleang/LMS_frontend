import { Module } from '@nestjs/common';
import { SubjectResolver } from './subject.resolver';
import { SubjectService } from './subject.service';

@Module({
  providers: [SubjectResolver, SubjectService],
})
export class SubjectModule {}
