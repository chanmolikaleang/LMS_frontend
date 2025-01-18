-- CreateTable
CREATE TABLE "Course" (
    "id" BIGSERIAL NOT NULL,
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "describtion" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" BIGSERIAL NOT NULL,
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "describtion" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "courseId" BIGINT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "courseId" BIGINT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_instructoreCourse" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "_studentCourse" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_uid_key" ON "Course"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Material_uid_key" ON "Material"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "_instructoreCourse_AB_unique" ON "_instructoreCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_instructoreCourse_B_index" ON "_instructoreCourse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_studentCourse_AB_unique" ON "_studentCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_studentCourse_B_index" ON "_studentCourse"("B");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_instructoreCourse" ADD CONSTRAINT "_instructoreCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_instructoreCourse" ADD CONSTRAINT "_instructoreCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_studentCourse" ADD CONSTRAINT "_studentCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_studentCourse" ADD CONSTRAINT "_studentCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
