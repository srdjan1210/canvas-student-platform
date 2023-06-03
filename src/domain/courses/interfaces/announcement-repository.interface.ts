import { Announcement } from '../announcement';
import { PersonalAnnouncementParams } from '../types/student-announcement-params.type';

export interface IAnnouncementRepository {
  getPersonalAnnouncements(
    params: PersonalAnnouncementParams,
  ): Promise<Announcement[]>;

  create(announcement: Announcement): Promise<Announcement>;
  getCourseAnnouncements(title: string): Promise<Announcement[]>;
}
