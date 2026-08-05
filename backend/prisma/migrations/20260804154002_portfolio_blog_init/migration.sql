/*
  Warnings:

  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_emojiId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_postId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropIndex
DROP INDEX "post_search_vector_gin";

-- DropIndex
DROP INDEX "project_search_vector_gin";

-- DropIndex
DROP INDEX "skill_search_vector_gin";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "searchVector" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "emojiId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "searchVector" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Reaction_emojiId_idx" ON "Reaction"("emojiId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_emojiId_fkey" FOREIGN KEY ("emojiId") REFERENCES "Emoji"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
