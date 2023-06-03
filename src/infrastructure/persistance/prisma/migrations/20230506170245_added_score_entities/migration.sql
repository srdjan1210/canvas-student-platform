-- CreateTable
CREATE TABLE "ScoreEntity" (
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ScoreEntity_pkey" PRIMARY KEY ("courseId","studentId")
);

-- CreateTable
CREATE TABLE "TestScoreEntity" (
    "testId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "TestScoreEntity_pkey" PRIMARY KEY ("testId","courseId","studentId")
);

-- CreateTable
CREATE TABLE "TestEntity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "maxPoints" DOUBLE PRECISION NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "TestEntity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScoreEntity" ADD CONSTRAINT "ScoreEntity_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreEntity" ADD CONSTRAINT "ScoreEntity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestScoreEntity" ADD CONSTRAINT "TestScoreEntity_courseId_studentId_fkey" FOREIGN KEY ("courseId", "studentId") REFERENCES "ScoreEntity"("courseId", "studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestScoreEntity" ADD CONSTRAINT "TestScoreEntity_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestEntity" ADD CONSTRAINT "TestEntity_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
