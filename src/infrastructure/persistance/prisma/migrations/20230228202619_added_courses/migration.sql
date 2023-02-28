-- CreateTable
CREATE TABLE "CourseEntity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "espb" INTEGER NOT NULL,

    CONSTRAINT "CourseEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseEntityToSpecializationEntity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseEntityToStudentEntity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseEntityToProfessorEntity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseEntityToSpecializationEntity_AB_unique" ON "_CourseEntityToSpecializationEntity"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseEntityToSpecializationEntity_B_index" ON "_CourseEntityToSpecializationEntity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseEntityToStudentEntity_AB_unique" ON "_CourseEntityToStudentEntity"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseEntityToStudentEntity_B_index" ON "_CourseEntityToStudentEntity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseEntityToProfessorEntity_AB_unique" ON "_CourseEntityToProfessorEntity"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseEntityToProfessorEntity_B_index" ON "_CourseEntityToProfessorEntity"("B");

-- AddForeignKey
ALTER TABLE "_CourseEntityToSpecializationEntity" ADD CONSTRAINT "_CourseEntityToSpecializationEntity_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseEntityToSpecializationEntity" ADD CONSTRAINT "_CourseEntityToSpecializationEntity_B_fkey" FOREIGN KEY ("B") REFERENCES "SpecializationEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseEntityToStudentEntity" ADD CONSTRAINT "_CourseEntityToStudentEntity_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseEntityToStudentEntity" ADD CONSTRAINT "_CourseEntityToStudentEntity_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseEntityToProfessorEntity" ADD CONSTRAINT "_CourseEntityToProfessorEntity_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseEntityToProfessorEntity" ADD CONSTRAINT "_CourseEntityToProfessorEntity_B_fkey" FOREIGN KEY ("B") REFERENCES "ProfessorEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
