import { ICourseTestRepository } from '../../../domain/scores/interfaces/course-test-repository.interface';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { CourseTest } from '../../../domain/scores/model/course-test';
import { CourseTestMapperFactory } from '../factories/course-test-mapper.factory';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { TestScore } from '../../../domain/scores/model/test-score';
import { StudentTestScore } from '../../../domain/scores/types/student-test-score.type';
import { StudentTestScoresParams } from '../../../domain/scores/types/student-test-scores-params.type';

@Injectable()
export class CourseTestRepository implements ICourseTestRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly testMapperFactory: CourseTestMapperFactory,
  ) {}

  async findById(id: number): Promise<CourseTest> {
    const test = await this.prisma.testEntity.findUnique({
      where: { id },
    });

    return this.testMapperFactory.fromEntity(test);
  }

  async update({
    id,
    courseId,
    title,
    maxPoints,
    testScores,
  }: CourseTest): Promise<void> {
    await this.prisma.testEntity.update({
      where: { id },
      data: {
        title,
        maxPoints,
        testScores: testScores
          ? {
              create: testScores.map((score) => ({
                courseId: score.courseId,
                studentId: score.studentId,
                points: score.points,
                fileUrl: score.fileUrl,
              })),
            }
          : undefined,
      },
    });
  }

  async deleteOne(id: number): Promise<void> {
    await this.prisma.testEntity.delete({
      where: {
        id,
      },
    });
  }

  async findAllByCourse(title: string): Promise<CourseTest[]> {
    const tests = await this.prisma.testEntity.findMany({
      where: {
        course: {
          title,
        },
      },
      include: {
        course: true,
      },
    });

    return tests.map((test) => this.testMapperFactory.fromEntity(test));
  }

  async getStudentTestScores({
    courseId,
    testId,
    page,
    limit,
  }: StudentTestScoresParams): Promise<StudentTestScore[]> {
    const testIdString = testId.toString();
    const offset = (page - 1) * limit;
    return this.prisma.$queryRaw<StudentTestScore[]>`
        WITH course_students AS (
            SELECT cs."studentId" 
            FROM "CourseStudentEntity" cs
            WHERE cs."courseId" = ${courseId}
        ),
        student_scores AS (
            SELECT *
            FROM "TestScoreEntity" ts 
            WHERE ts."testId" = ${testId}
        )
        SELECT s.*, ts.*        
        FROM "StudentEntity" s LEFT JOIN (select * from student_scores) ts on s.id = ts."studentId"
        WHERE s.id IN (SELECT * FROM course_students) 
        LIMIT ${limit} 
        OFFSET ${offset}
      `;
  }
}
