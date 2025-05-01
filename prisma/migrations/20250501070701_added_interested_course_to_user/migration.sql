-- CreateTable
CREATE TABLE "_UserInterestedCategories" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserInterestedCategories_AB_unique" ON "_UserInterestedCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_UserInterestedCategories_B_index" ON "_UserInterestedCategories"("B");

-- AddForeignKey
ALTER TABLE "_UserInterestedCategories" ADD CONSTRAINT "_UserInterestedCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInterestedCategories" ADD CONSTRAINT "_UserInterestedCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
