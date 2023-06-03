import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import {
  CourseEntity,
  StudentEntity,
  TestEntity,
  TestScoreEntity,
} from '@prisma/client';
import { TestScore } from '../../../domain/scores/model/test-score';
import { CourseTest } from '../../../domain/scores/model/course-test';
import { Student } from '../../../domain/specialization/model/student';
import { Course } from '../../../domain/courses/course';

type TestScoreMapperEntity = TestScoreEntity & {
  test?: TestEntity;
  student?: StudentEntity;
  course?: CourseEntity;
};
export class TestScoreMapperFactory
  implements IEntityMapperFactory<TestScoreMapperEntity, TestScore>
{
  fromEntity({
    testId,
    studentId,
    courseId,
    points,
    fileUrl,
    test,
    student,
    course,
  }: TestScoreMapperEntity): TestScore {
    const testMapped = test
      ? CourseTest.create({
          description: test.description,
          maxPoints: test.maxPoints,
          title: test.title,
        })
      : undefined;

    const studentMapped = student
      ? Student.create({
          id: student.id,
          fullIndex: student.fullIndex,
          indexNumber: student.indexNumber,
          specializationName: student.specializationName,
          name: student.name,
          surname: student.surname,
          year: student.indexYear,
          userId: student.userId,
        })
      : undefined;
    const courseMapped = course
      ? Course.create({
          id: course.id,
          year: course.year,
          title: course.title,
          description: course.description,
        })
      : undefined;

    return TestScore.create({
      testId,
      studentId,
      courseId,
      points,
      fileUrl,
      test: testMapped,
      course: courseMapped,
      student: studentMapped,
    });
  }

  fromModel({
    testId,
    courseId,
    points,
    fileUrl,
    studentId,
  }: TestScore): TestScoreMapperEntity {
    return {
      testId,
      courseId,
      studentId,
      points,
      fileUrl,
    };
  }
}
