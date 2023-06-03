import { CourseTest } from '../model/course-test';
import { TestScore } from '../model/test-score';
import { StudentTestScore } from '../types/student-test-score.type';
import { StudentTestScoresParams } from '../types/student-test-scores-params.type';

export interface ICourseTestRepository {
  findAllByCourse(title: string): Promise<CourseTest[]>;
  findById(id: number): Promise<CourseTest>;
  update(test: CourseTest): Promise<void>;
  deleteOne(id: number): Promise<void>;

  getStudentTestScores(
    params: StudentTestScoresParams,
  ): Promise<StudentTestScore[]>;
}
