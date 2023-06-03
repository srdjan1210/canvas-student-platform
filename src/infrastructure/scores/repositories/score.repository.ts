import { IScoreRepository } from '../../../domain/scores/interfaces/score-repository.interface';
import { TestScore } from '../../../domain/scores/model/test-score';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { TestScoreMapperFactory } from '../factories/test-score-mapper.factory';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { MyCourseScore } from '../../../domain/scores/types/my-course-score';

@Injectable()
export class ScoreRepository implements IScoreRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly testScoreMapperFactory: TestScoreMapperFactory,
  ) {}
  async create({
    studentId,
    courseId,
    testId,
    points,
    fileUrl,
  }: TestScore): Promise<TestScore> {
    const created = await this.prisma.testScoreEntity.create({
      data: {
        studentId,
        courseId,
        testId,
        points,
        fileUrl,
      },
    });

    return this.testScoreMapperFactory.fromEntity(created);
  }

  async update({
    courseId,
    studentId,
    testId,
    fileUrl,
    points = 0,
  }: TestScore): Promise<TestScore> {
    console.log(courseId, testId, studentId, fileUrl, points);
    const updated = await this.prisma.testScoreEntity.update({
      where: {
        courseId_studentId_testId: {
          courseId,
          studentId,
          testId,
        },
      },
      data: {
        fileUrl: fileUrl ?? undefined,
        points: points ?? undefined,
      },
    });

    return this.testScoreMapperFactory.fromEntity(updated);
  }

  async delete({ courseId, studentId, testId }: TestScore): Promise<void> {
    await this.prisma.testScoreEntity.delete({
      where: {
        courseId_studentId_testId: {
          courseId,
          studentId,
          testId,
        },
      },
    });
  }

  async findStudentsScoresWithNotSubmitted(
    studentId: number,
    courseId: number,
  ): Promise<MyCourseScore[]> {
    return this.prisma.$queryRaw`
        WITH course_tests AS  (
          SELECT id
          FROM "TestEntity"
          WHERE "courseId" = ${courseId}
        )
        SELECT 
            t.id as "testId", 
            t.title as "title", 
            ts.points as "points", 
            t.description as "description", 
            t."deadlineForSubmission" as "submissionDate", 
            t."maxPoints" as "maxPoints", 
            ts."fileUrl" as "lastSubmission" 
        FROM "TestEntity" t LEFT JOIN "TestScoreEntity" ts ON t.id = ts."testId"
        WHERE t.id IN (SELECT * FROM course_tests) AND (ts."studentId" IS NULL OR ts."studentId" = ${studentId})
    `;
  }

  async findStudentScores(
    studentId: number,
    courseId: number,
  ): Promise<TestScore[]> {
    const student = await this.prisma.courseStudentEntity.findUnique({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
      include: {
        testScores: {
          where: {
            courseId,
          },
          include: {
            test: true,
          },
        },
      },
    });

    return student.testScores.map((score) =>
      this.testScoreMapperFactory.fromEntity(score),
    );
  }

  async findById(
    courseId: number,
    studentId: number,
    testId: number,
  ): Promise<TestScore> {
    const score = await this.prisma.testScoreEntity.findUnique({
      where: {
        courseId_studentId_testId: {
          courseId,
          studentId,
          testId,
        },
      },
    });
    if (!score) return null;
    return this.testScoreMapperFactory.fromEntity(score);
  }

  async findOrCreate({
    courseId,
    studentId,
    testId,
    points = 0,
    fileUrl = null,
  }: TestScore): Promise<TestScore> {
    const score = await this.prisma.testScoreEntity.upsert({
      where: {
        courseId_studentId_testId: {
          courseId,
          studentId,
          testId,
        },
      },
      update: {},
      create: {
        courseId,
        studentId,
        testId,
        points,
        fileUrl,
      },
    });
    return this.testScoreMapperFactory.fromEntity(score);
  }
}
