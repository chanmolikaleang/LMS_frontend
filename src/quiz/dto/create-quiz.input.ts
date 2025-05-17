// create-quiz.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field()
  text: string;

  @Field(() => [String])
  options: string[];

  @Field(() => Int)
  correctAnswerIndex: number;

  @Field(() => Int)
  score: number;
}

@InputType()
export class CreateQuizInput {
  @Field()
  title: string;

  @Field(() => [CreateQuestionInput])
  questions: CreateQuestionInput[];
}

@InputType()
export class SubmitQuizInput {
  @Field(() => String)
  studentUid: string;

  @Field(() => String)
  quizUid: string;

  @Field(() => [QuizAnswerInput])
  answers: QuizAnswerInput[];
}

@InputType()
export class QuizAnswerInput {
  @Field(() => String)
  questionId: string;

  @Field(() => Int)
  selectedIndex: number;
}
