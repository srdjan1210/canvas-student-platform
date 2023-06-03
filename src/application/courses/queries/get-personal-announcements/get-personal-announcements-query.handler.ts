import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ANNOUNCEMENT_REPOSITORY } from '../../../../domain/courses/course.constants';
import { IAnnouncementRepository } from '../../../../domain/courses/interfaces/announcement-repository.interface';
import { PersonalAnnouncementParams } from '../../../../domain/courses/types/student-announcement-params.type';
import { DEFAULT_PAGINATION_PAGE } from '../../../specialization/specialization.constants';
import { GetPersonalAnnouncementsQuery } from './get-personal-announcements.query';

@QueryHandler(GetPersonalAnnouncementsQuery)
export class GetPersonalAnnouncementsQueryHandler
  implements IQueryHandler<GetPersonalAnnouncementsQuery>
{
  constructor(
    @Inject(ANNOUNCEMENT_REPOSITORY)
    private readonly announcementRepository: IAnnouncementRepository,
  ) {}
  async execute({
    authorized,
    page,
    limit,
  }: GetPersonalAnnouncementsQuery): Promise<any> {
    const params: PersonalAnnouncementParams = {
      userId: authorized,
      page: !page || page <= 0 ? DEFAULT_PAGINATION_PAGE : page,
      limit: !limit || limit <= 5 ? DEFAULT_PAGINATION_PAGE : limit,
    };
    return this.announcementRepository.getPersonalAnnouncements(params);
  }
}
