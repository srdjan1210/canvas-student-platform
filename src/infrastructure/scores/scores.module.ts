import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaModule } from '../persistance/prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { CreateScoreCommandHandler } from '../../application/scores/commands/create-score/create-score-command.handler';
import { TestScoreMapperFactory } from './factories/test-score-mapper.factory';
import { ScoreRepository } from './repositories/score.repository';
import {
  COURSE_TEST_REPOSITORY,
  SCORE_REPOSITORY,
} from '../../domain/scores/score.constants';
import { CourseTestRepository } from './repositories/course-test.repository';
import { UpdateScorePointsCommandHandler } from '../../application/scores/commands/update-score-points/update-score-points-command.handler';
import { UpdateScoreCommandHandler } from '../../application/scores/commands/update-score/update-score-command.handler';
import { ReuploadTestFileCommandHandler } from '../../application/scores/commands/reupload-test-file/reupload-test-file.command.handler';
import { GetCourseTestResultsQueryHandler } from '../../application/scores/queries/get-course-results/get-course-test-results-query.handler';
import { CourseModule } from '../courses/course.module';
import { SpecializationModule } from '../specialization/specialization.module';
import { AuthModule } from '../auth/auth.module';
import { GetTestByIdQueryHandler } from '../../application/scores/queries/get-test-by-id-query/get-test-by-id-query.handler';
import { GetCourseTestsQueryHandler } from '../../application/scores/queries/get-course-tests/get-course-tests-query.handler';
import { CreateTestCommandHandler } from '../../application/scores/commands/create-test/create-test-command.handler';
import { ScoreController } from './score.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CourseTestMapperFactory } from './factories/course-test-mapper.factory';
import { DeleteTestCommandHandler } from '../../application/scores/commands/delete-test/delete-test-command.handler';
import { GetCourseStudentTestScoresQueryHandler } from '../../application/scores/queries/get-course-student-test-scores/get-course-student-test-scores-query.handler';
import { GetStudentTestScoresWithNotSubmittedQueryHandler } from '../../application/scores/queries/get-student-test-scores-with-not-submitted/get-student-test-scores-with-not-submitted-query.handler';
import { TestCreatedEventHandler } from '../../application/scores/events/test-created-event.handler';

const commands: Provider[] = [
  CreateScoreCommandHandler,
  UpdateScorePointsCommandHandler,
  UpdateScoreCommandHandler,
  ReuploadTestFileCommandHandler,
  CreateTestCommandHandler,
  DeleteTestCommandHandler,
];
const queries: Provider[] = [
  GetCourseTestResultsQueryHandler,
  GetTestByIdQueryHandler,
  GetCourseTestsQueryHandler,
  GetCourseStudentTestScoresQueryHandler,
  GetStudentTestScoresWithNotSubmittedQueryHandler,
];
const events: Provider[] = [TestCreatedEventHandler];
const providers: Provider[] = [
  TestScoreMapperFactory,
  {
    provide: SCORE_REPOSITORY,
    useClass: ScoreRepository,
  },
  {
    provide: COURSE_TEST_REPOSITORY,
    useClass: CourseTestRepository,
  },
  CourseTestMapperFactory,
];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    SharedModule,
    CourseModule,
    SpecializationModule,
    AuthModule,
  ],
  providers: [...commands, ...queries, ...providers, ...events],
  exports: [],
  controllers: [ScoreController],
})
export class ScoresModule {}
