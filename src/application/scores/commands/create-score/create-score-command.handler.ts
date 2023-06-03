import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateScoreCommand } from './create-score.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IScoreRepository } from '../../../../domain/scores/interfaces/score-repository.interface';
import { SCORE_REPOSITORY } from '../../../../domain/scores/score.constants';
import { TestScore } from '../../../../domain/scores/model/test-score';

@CommandHandler(CreateScoreCommand)
export class CreateScoreCommandHandler
  implements ICommandHandler<CreateScoreCommand>
{
  constructor(
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
  ) {}

  async execute({ courseId, studentId, testId, points }: CreateScoreCommand) {
    const score = TestScore.create({
      studentId,
      courseId,
      testId,
      points,
    });

    await this.scoreRepository.create(score);
  }
}
