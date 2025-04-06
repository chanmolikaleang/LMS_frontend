/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `CourseProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CourseProgress" ADD COLUMN     "uid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "uid" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgress_uid_key" ON "CourseProgress"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_uid_key" ON "Progress"("uid");
