import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPersonalAnnouncementsQuery } from '../../../application/courses/queries/get-personal-announcements/get-personal-announcements.query';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { ReqWithUser } from '../../auth/guards/role.guard';
import { DomainErrorFilter } from '../../error-handling/domain-error.filter';
import { AnnouncementPresenter } from '../presenters/announcement.presenter';

@Controller('announcements')
@UseFilters(DomainErrorFilter)
export class AnnouncementController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/personal')
  @UseGuards(JwtGuard)
  async getStudentAnnouncements(
    @Req() { user }: ReqWithUser,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const announcements = await this.queryBus.execute(
      new GetPersonalAnnouncementsQuery(user.id, page, limit),
    );

    return announcements.map((ann) => new AnnouncementPresenter(ann));
  }
}
