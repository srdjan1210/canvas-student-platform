import { Announcement } from '../announcement';

export class AnnouncementCreatedEvent {
  constructor(public readonly announcement: Announcement) {}
}
