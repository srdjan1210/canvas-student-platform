import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { CourseEntity, TestEntity } from '@prisma/client';
import { CourseTest } from '../../../domain/scores/model/course-test';
import { Course } from '../../../domain/courses/course';

export class CourseTestMapperFactory
  implements
    IEntityMapperFactory<TestEntity & { course?: CourseEntity }, CourseTest>
{
  fromEntity({
    id,
    courseId,
    title,
    maxPoints,
    description,
    deadlineForSubmission,
    course,
  }: TestEntity & { course?: CourseEntity }): CourseTest {
    const courseMapped = course
      ? Course.create({
          id: course.id,
          title: course.title,
          year: course.year,
          description: course.description,
        })
      : undefined;
    return CourseTest.create({
      id,
      courseId,
      title,
      maxPoints,
      description,
      deadlineForSubmission,
      course: courseMapped,
    });
  }

  fromModel({
    id,
    maxPoints,
    courseId,
    title,
    description,
    deadlineForSubmission,
  }: CourseTest): TestEntity & { course?: CourseEntity } {
    return {
      id,
      maxPoints,
      courseId,
      title,
      description,
      deadlineForSubmission,
    };
  }
}
