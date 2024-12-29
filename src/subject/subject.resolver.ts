import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SubjectService } from './subject.service';
import { Subject } from './entity/subject.entity';
import { CreateSubjectInput } from './dto/create-subject.input';

@Resolver()
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}

  @Mutation(() => Subject, { name: 'createSuject' })
  async createTeacher(
    @Args('createUserInput') createSubjectInput: CreateSubjectInput,
  ) {
    return await this.subjectService.create(createSubjectInput);
  }

  @Query(() => Subject, { name: 'getSubject' })
  async findOne(@Args('uid') uid: string) {
    return await this.subjectService.findOne(uid);
  }

  @Query(() => [Subject], { name: 'getSubjects' })
  async findAll() {
    return await this.subjectService.findAll();
  }
}
