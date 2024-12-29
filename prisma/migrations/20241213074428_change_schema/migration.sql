/*
  Warnings:

  - You are about to drop the column `classroomSubjectId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the `ClassroomSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClassroomToStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classroomId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_classroomSubjectId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomSubject" DROP CONSTRAINT "ClassroomSubject_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomSubject" DROP CONSTRAINT "ClassroomSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomSubject" DROP CONSTRAINT "ClassroomSubject_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomToStudent" DROP CONSTRAINT "_ClassroomToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomToStudent" DROP CONSTRAINT "_ClassroomToStudent_B_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "classroomSubjectId",
DROP COLUMN "studentId",
ADD COLUMN     "classroomId" BIGINT NOT NULL,
ADD COLUMN     "subjectId" BIGINT NOT NULL,
ADD COLUMN     "userId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "teacherId" BIGINT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "classId" BIGINT,
ADD COLUMN     "subjectId" BIGINT;

-- DropTable
DROP TABLE "ClassroomSubject";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Teacher";

-- DropTable
DROP TABLE "_ClassroomToStudent";

-- DropTable
DROP TABLE "_SubjectToTeacher";

-- CreateTable
CREATE TABLE "_StudentClass" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StudentClass_AB_unique" ON "_StudentClass"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentClass_B_index" ON "_StudentClass"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentClass" ADD CONSTRAINT "_StudentClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentClass" ADD CONSTRAINT "_StudentClass_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
