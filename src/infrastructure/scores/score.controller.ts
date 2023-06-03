import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateScoreDto } from './dtos/update-score.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ReqWithUser, RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../../domain/auth/role.enum';
import { FileExtensionValidator } from '../courses/validators/file-extension.validator';
import { UpdateScoreCommand } from '../../application/scores/commands/update-score/update-score.command';
import { ReuploadTestFileCommand } from '../../application/scores/commands/reupload-test-file/reupload-test-file.command';
import { EvaluateTestDto } from './dtos/evaluate-test.dto';
import { UpdateScorePointsCommand } from '../../application/scores/commands/update-score-points/update-score-points.command';
import { GetCourseTestResultsQuery } from '../../application/scores/queries/get-course-results/get-course-test-results.query';
import { CourseResultPresenter } from './presenters/course-result.presenter';
import { GetTestByIdQuery } from '../../application/scores/queries/get-test-by-id-query/get-test-by-id.query';
import { TestPresenter } from './presenters/test.presenter';
import { CreateTestDto } from '../courses/dtos/create-test.dto';
import { CreateTestCommand } from '../../application/scores/commands/create-test/create-test.command';
import { GetCourseTestsQuery } from '../../application/scores/queries/get-course-tests/get-course-tests.query';
import { DeleteTestCommand } from '../../application/scores/commands/delete-test/delete-test.command';
import { GetCourseStudentTestScoresQuery } from '../../application/scores/queries/get-course-student-test-scores/get-course-student-test-scores.query';
import { DomainErrorFilter } from '../error-handling/domain-error.filter';
import { GetStudentTestScoresWithNotSubmittedQuery } from '../../application/scores/queries/get-student-test-scores-with-not-submitted/get-student-test-scores-with-not-submitted.query';

@Controller('/scores')
@UseFilters(DomainErrorFilter)
export class ScoreController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/:title/:studentId/:testId')
  async updateScore(
    @Body() data: UpdateScoreDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileExtensionValidator({
            regex: /\.(zip)$/,
          }),
          new MaxFileSizeValidator({ maxSize: 100000000 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('title') title: string,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('testId', ParseIntPipe) testId: number,
    @Req() { user }: ReqWithUser,
  ) {
    const buffer = file.buffer;

    await this.commandBus.execute(
      new UpdateScoreCommand(
        user.id,
        title,
        studentId,
        testId,
        buffer,
        data.points,
      ),
    );

    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/courses/:title/:testId/submit')
  async uploadTestFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileExtensionValidator({
            regex: /\.(zip)$/,
          }),
          new MaxFileSizeValidator({ maxSize: 100000000 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('title') title: string,
    @Param('testId', ParseIntPipe) testId: number,
    @Req() { user }: ReqWithUser,
  ) {
    const buffer = file.buffer;

    await this.commandBus.execute(
      new ReuploadTestFileCommand(user.id, title, testId, buffer),
    );

    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/evaluate/:title/:studentId/:testId')
  async evaluateTest(
    @Body() dto: EvaluateTestDto,
    @Param('title') title: string,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('testId', ParseIntPipe) testId: number,
    @Req() { user }: ReqWithUser,
  ) {
    await this.commandBus.execute(
      new UpdateScorePointsCommand(
        user.id,
        title,
        studentId,
        testId,
        dto.score,
      ),
    );

    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/:courseId')
  async getCourseTestResults(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() { user }: ReqWithUser,
  ) {
    const results = await this.queryBus.execute(
      new GetCourseTestResultsQuery(user.id, courseId),
    );

    return results.map((result) => new CourseResultPresenter(result));
  }

  @Roles(UserRole.PROFESSOR, UserRole.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/test/:testId')
  async getTest(@Param('testId', ParseIntPipe) testId: number) {
    const test = await this.queryBus.execute(new GetTestByIdQuery(testId));

    return new TestPresenter(test);
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard)
  @Post('/courses/:title/tests')
  async createTest(
    @Param('title') title: string,
    @Body() { name, description, points, deadlineForSubmission }: CreateTestDto,
    @Req() { user }: ReqWithUser,
  ) {
    await this.commandBus.execute(
      new CreateTestCommand(
        user.id,
        title,
        name,
        description,
        points,
        deadlineForSubmission,
      ),
    );

    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard)
  @Get('/courses/:title/tests')
  async getTests(@Param('title') title: string, @Req() { user }: ReqWithUser) {
    const tests = await this.queryBus.execute(
      new GetCourseTestsQuery(user.id, title),
    );
    return tests.map((test) => new TestPresenter(test));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard)
  @Delete('/tests/:id')
  async deleteTest(
    @Req() { user }: ReqWithUser,
    @Param('id', ParseIntPipe) testId: number,
  ) {
    await this.commandBus.execute(new DeleteTestCommand(user.id, testId));
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/courses/:title/tests/:testId/submissions')
  async getStudentSubmissions(
    @Req() { user }: ReqWithUser,
    @Param('title') title: string,
    @Param('testId', ParseIntPipe) testId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const scores = await this.queryBus.execute(
      new GetCourseStudentTestScoresQuery(user.id, title, testId, page, limit),
    );
    return scores;
  }

  @Roles(UserRole.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/courses/:title/tests/submissions/all')
  async getStudentTestScoresWithNotSubmitted(
    @Param('title') title: string,
    @Req() { user }: ReqWithUser,
  ) {
    return this.queryBus.execute(
      new GetStudentTestScoresWithNotSubmittedQuery(user.id, title),
    );
  }
}
