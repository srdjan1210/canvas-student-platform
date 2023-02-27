-- CreateTable
CREATE TABLE "StudentEntity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "specializationName" TEXT NOT NULL,
    "indexNumber" INTEGER NOT NULL,
    "indexYear" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StudentEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorEntity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProfessorEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecializationEntity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "SpecializationEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentEntity_userId_key" ON "StudentEntity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEntity_specializationName_indexNumber_indexYear_key" ON "StudentEntity"("specializationName", "indexNumber", "indexYear");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorEntity_userId_key" ON "ProfessorEntity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SpecializationEntity_shortName_key" ON "SpecializationEntity"("shortName");

-- AddForeignKey
ALTER TABLE "StudentEntity" ADD CONSTRAINT "StudentEntity_name_fkey" FOREIGN KEY ("name") REFERENCES "SpecializationEntity"("shortName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEntity" ADD CONSTRAINT "StudentEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorEntity" ADD CONSTRAINT "ProfessorEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
