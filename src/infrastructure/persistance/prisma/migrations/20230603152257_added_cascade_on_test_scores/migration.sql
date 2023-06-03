-- DropForeignKey
ALTER TABLE "TestScoreEntity" DROP CONSTRAINT "TestScoreEntity_courseId_studentId_fkey";

-- AddForeignKey
ALTER TABLE "TestScoreEntity" ADD CONSTRAINT "TestScoreEntity_courseId_studentId_fkey" FOREIGN KEY ("courseId", "studentId") REFERENCES "CourseStudentEntity"("courseId", "studentId") ON DELETE CASCADE ON UPDATE CASCADE;
