/*
  Warnings:

  - You are about to drop the column `activationLink` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_activationLink_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activationLink",
ADD COLUMN     "activationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_activationToken_key" ON "User"("activationToken");
