import { Module } from '@nestjs/common';
import { QuizResolver } from './quiz.resolver';

@Module({
  providers: [QuizResolver]
})
export class QuizModule {}
