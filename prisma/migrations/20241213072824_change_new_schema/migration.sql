/*
  Warnings:

  - You are about to drop the column `classroomId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Classroom` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_StudentClass` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classroomSubjectId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "_StudentClass" DROP CONSTRAINT "_StudentClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentClass" DROP CONSTRAINT "_StudentClass_B_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "classroomId",
DROP COLUMN "subjectId",
DROP COLUMN "userId",
ADD COLUMN     "classroomSubjectId" BIGINT NOT NULL,
ADD COLUMN     "studentId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "classId",
DROP COLUMN "subjectId";

-- DropTable
DROP TABLE "_StudentClass";

-- CreateTable
CREATE TABLE "ClassroomSubject" (
    "id" BIGSERIAL NOT NULL,
    "classroomId" BIGINT NOT NULL,
    "subjectId" BIGINT NOT NULL,
    "teacherId" BIGINT NOT NULL,

    CONSTRAINT "ClassroomSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassroomToStudent" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "_SubjectToTeacher" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassroomToStudent_AB_unique" ON "_ClassroomToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassroomToStudent_B_index" ON "_ClassroomToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToTeacher_AB_unique" ON "_SubjectToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectToTeacher_B_index" ON "_SubjectToTeacher"("B");

-- AddForeignKey
ALTER TABLE "ClassroomSubject" ADD CONSTRAINT "ClassroomSubject_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomSubject" ADD CONSTRAINT "ClassroomSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomSubject" ADD CONSTRAINT "ClassroomSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classroomSubjectId_fkey" FOREIGN KEY ("classroomSubjectId") REFERENCES "ClassroomSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToStudent" ADD CONSTRAINT "_ClassroomToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToStudent" ADD CONSTRAINT "_ClassroomToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
