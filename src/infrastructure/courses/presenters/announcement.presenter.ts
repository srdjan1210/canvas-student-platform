import { Announcement } from '../../../domain/courses/announcement';

export class AnnouncementPresenter {
  public id: number;
  public professorName: string;
  public professorSurname: string;
  public title: string;
  public body: string;
  public avatar: string;
  public createdAt: Date;
  public courseTitle: string;
  constructor({ title, id, body, course, professor, createdAt }: Announcement) {
    this.id = id;
    this.professorName = professor?.name;
    this.professorSurname = professor?.surname;
    this.title = title;
    this.body = body;
    this.createdAt = createdAt;
    this.avatar = professor?.user?.avatar;
    this.courseTitle = course?.title;
  }
}
