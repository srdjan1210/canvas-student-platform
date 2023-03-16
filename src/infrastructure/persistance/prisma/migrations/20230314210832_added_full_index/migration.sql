/*
  Warnings:

  - Added the required column `fullIndex` to the `StudentEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentEntity" ADD COLUMN     "fullIndex" TEXT NOT NULL;
