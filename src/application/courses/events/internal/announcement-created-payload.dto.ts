import { Announcement } from '../../../../domain/courses/announcement';

export class AnnouncementCreatedPayload {
  constructor(
    public readonly ids: number[],
    public readonly notification: Announcement,
  ) {}
}
