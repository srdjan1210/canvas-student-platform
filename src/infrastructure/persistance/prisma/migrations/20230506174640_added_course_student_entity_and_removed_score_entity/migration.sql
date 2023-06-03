/*
  Warnings:

  - The primary key for the `TestScoreEntity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `ScoreEntity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseEntityToStudentEntity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `points` to the `TestScoreEntity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScoreEntity" DROP CONSTRAINT "ScoreEntity_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ScoreEntity" DROP CONSTRAINT "ScoreEntity_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TestScoreEntity" DROP CONSTRAINT "TestScoreEntity_courseId_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TestScoreEntity" DROP CONSTRAINT "TestScoreEntity_testId_fkey";

-- DropForeignKey
ALTER TABLE "_CourseEntityToStudentEntity" DROP CONSTRAINT "_CourseEntityToStudentEntity_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseEntityToStudentEntity" DROP CONSTRAINT "_CourseEntityToStudentEntity_B_fkey";

-- AlterTable
ALTER TABLE "CourseEntity" ADD COLUMN     "studentEntityId" INTEGER;

-- AlterTable
ALTER TABLE "TestScoreEntity" DROP CONSTRAINT "TestScoreEntity_pkey",
ADD COLUMN     "points" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "TestScoreEntity_pkey" PRIMARY KEY ("courseId", "studentId", "testId");

-- DropTable
DROP TABLE "ScoreEntity";

-- DropTable
DROP TABLE "_CourseEntityToStudentEntity";

-- CreateTable
CREATE TABLE "CourseStudentEntity" (
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "CourseStudentEntity_pkey" PRIMARY KEY ("courseId","studentId")
);

-- AddForeignKey
ALTER TABLE "CourseEntity" ADD CONSTRAINT "CourseEntity_studentEntityId_fkey" FOREIGN KEY ("studentEntityId") REFERENCES "StudentEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseStudentEntity" ADD CONSTRAINT "CourseStudentEntity_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseStudentEntity" ADD CONSTRAINT "CourseStudentEntity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestScoreEntity" ADD CONSTRAINT "TestScoreEntity_courseId_studentId_fkey" FOREIGN KEY ("courseId", "studentId") REFERENCES "CourseStudentEntity"("courseId", "studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
