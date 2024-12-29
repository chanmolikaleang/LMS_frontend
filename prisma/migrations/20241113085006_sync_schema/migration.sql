/*
  Warnings:

  - You are about to drop the `_TeacherClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TeacherClass" DROP CONSTRAINT "_TeacherClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeacherClass" DROP CONSTRAINT "_TeacherClass_B_fkey";

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "teacherId" BIGINT;

-- DropTable
DROP TABLE "_TeacherClass";

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
