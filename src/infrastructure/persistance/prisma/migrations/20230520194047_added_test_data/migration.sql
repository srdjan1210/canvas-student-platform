/*
  Warnings:

  - You are about to drop the column `studentEntityId` on the `CourseEntity` table. All the data in the column will be lost.
  - Added the required column `description` to the `TestEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `TestScoreEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseEntity" DROP COLUMN "studentEntityId";

-- AlterTable
ALTER TABLE "TestEntity" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestScoreEntity" ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TestScoreEntity" ADD CONSTRAINT "TestScoreEntity_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
