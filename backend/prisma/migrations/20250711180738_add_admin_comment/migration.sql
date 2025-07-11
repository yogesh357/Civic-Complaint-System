/*
  Warnings:

  - You are about to drop the column `adminComment` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "adminComment" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "adminComment";
