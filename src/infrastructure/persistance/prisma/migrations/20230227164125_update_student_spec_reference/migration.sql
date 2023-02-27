-- DropForeignKey
ALTER TABLE "StudentEntity" DROP CONSTRAINT "StudentEntity_name_fkey";

-- AddForeignKey
ALTER TABLE "StudentEntity" ADD CONSTRAINT "StudentEntity_specializationName_fkey" FOREIGN KEY ("specializationName") REFERENCES "SpecializationEntity"("shortName") ON DELETE RESTRICT ON UPDATE CASCADE;
