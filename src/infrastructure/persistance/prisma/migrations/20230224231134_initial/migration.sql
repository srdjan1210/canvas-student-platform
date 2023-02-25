-- CreateEnum
CREATE TYPE "UserEntityRole" AS ENUM ('ADMINISTRATOR', 'PROFESSOR', 'STUDENT');

-- CreateTable
CREATE TABLE "UserEntity" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserEntityRole" NOT NULL,

    CONSTRAINT "UserEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEntity_email_key" ON "UserEntity"("email");
