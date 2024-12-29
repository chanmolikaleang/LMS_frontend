/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_classId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subjectId" BIGINT;

-- DropTable
DROP TABLE "Class";

-- CreateTable
CREATE TABLE "Classroom" (
    "id" BIGSERIAL NOT NULL,
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" BIGSERIAL NOT NULL,
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" BIGSERIAL NOT NULL,
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" BIGINT NOT NULL,
    "classroomId" BIGINT NOT NULL,
    "subjectId" BIGINT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentClass" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherClass" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_uid_key" ON "Classroom"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_uid_key" ON "Subject"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_uid_key" ON "Attendance"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentClass_AB_unique" ON "_StudentClass"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentClass_B_index" ON "_StudentClass"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherClass_AB_unique" ON "_TeacherClass"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherClass_B_index" ON "_TeacherClass"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_TeacherClass" ADD CONSTRAINT "_TeacherClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherClass" ADD CONSTRAINT "_TeacherClass_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
