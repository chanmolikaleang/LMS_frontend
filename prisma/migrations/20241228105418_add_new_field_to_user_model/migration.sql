-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "dateOfBirth" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "profileImg" TEXT;

-- CreateTable
CREATE TABLE "_ClassSubjects" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClassSubjects_AB_unique" ON "_ClassSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassSubjects_B_index" ON "_ClassSubjects"("B");

-- AddForeignKey
ALTER TABLE "_ClassSubjects" ADD CONSTRAINT "_ClassSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassSubjects" ADD CONSTRAINT "_ClassSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
