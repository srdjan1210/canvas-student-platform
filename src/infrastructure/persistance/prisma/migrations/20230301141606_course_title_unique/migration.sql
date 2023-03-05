/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `CourseEntity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AnnouncementEntity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "AnnouncementEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseEntity_title_key" ON "CourseEntity"("title");

-- AddForeignKey
ALTER TABLE "AnnouncementEntity" ADD CONSTRAINT "AnnouncementEntity_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementEntity" ADD CONSTRAINT "AnnouncementEntity_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "ProfessorEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
