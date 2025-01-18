/*
  Warnings:

  - The `status` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('Draft', 'Public', 'Deleted');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('Free', 'Paid');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "price" TEXT,
ADD COLUMN     "type" "CourseType",
DROP COLUMN "status",
ADD COLUMN     "status" "CourseStatus";
