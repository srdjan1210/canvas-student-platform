import { Student } from '../model/student';
import { PersonDto } from '../person.dto';
import { CourseAttendeeSearchParams } from '../types/course-attendee-search.type';

export interface IStudentRepository {
  findById(id: number): Promise<Student>;
  findPersonalInfos(studentIds: number[]): Promise<PersonDto[]>;
  findAllForCourse(courseId: number): Promise<Student[]>;
  searchStudents(text: string, page: number, limit: number): Promise<Student[]>;
  findAllNotCourseAttendees(
    params: CourseAttendeeSearchParams,
  ): Promise<Student[]>;
}
