import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTestByIdQuery } from './get-test-by-id.query';
import { ICourseTestRepository } from '../../../../domain/scores/interfaces/course-test-repository.interface';
import { COURSE_TEST_REPOSITORY } from '../../../../domain/scores/score.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@QueryHandler(GetTestByIdQuery)
export class GetTestByIdQueryHandler
  implements IQueryHandler<GetTestByIdQuery>
{
  constructor(
    @Inject(COURSE_TEST_REPOSITORY)
    private readonly testRepository: ICourseTestRepository,
  ) {}

  async execute({ testId }: GetTestByIdQuery) {
    return this.testRepository.findById(testId);
  }
}
