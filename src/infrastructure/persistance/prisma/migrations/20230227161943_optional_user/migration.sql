-- DropForeignKey
ALTER TABLE "StudentEntity" DROP CONSTRAINT "StudentEntity_userId_fkey";

-- AlterTable
ALTER TABLE "StudentEntity" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentEntity" ADD CONSTRAINT "StudentEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
