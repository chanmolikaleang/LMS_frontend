import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Quiz {
  @Field()
  uid: string;

  @Field()
  title: string;

  @Field()
  courseUid: string;

  @Field(() => [Question])
  questions: Question[];

  @Field(() => [QuizResult])
  result: QuizResult[];
}

@ObjectType()
export class Question {
  @Field()
  uid: string;

  @Field()
  text: string;

  @Field(() => [String])
  options: string[];

  @Field(() => Number)
  correctAnswerIndex: number;

  @Field(() => Number)
  score: number;
}

@ObjectType()
export class QuizResult {
  @Field()
  uid: string;

  @Field()
  answer: string;

  @Field()
  totalScore: number;

  @Field(() => User)
  questions: User;

  @Field(() => Quiz)
  quiz: Quiz;
}

@ObjectType()
export class SubmittedAnswerDetail {
  @Field()
  questionId: string;

  @Field()
  selectedIndex: number;

  @Field()
  correctAnswerIndex: number;

  @Field()
  isCorrect: boolean;

  @Field()
  score: number;
}

@ObjectType()
export class SubmitQuizResult {
  @Field()
  totalScore: number;

  @Field()
  obtainedScore: number;

  @Field(() => [SubmittedAnswerDetail])
  answerDetails: SubmittedAnswerDetail[];
}
