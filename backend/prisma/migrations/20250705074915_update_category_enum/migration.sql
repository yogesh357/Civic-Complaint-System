/*
  Warnings:

  - The values [ROADS,ELECTRICITY,PUBLIC_SAFETY] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('POTHOLE', 'WATER', 'STREETLIGHT', 'WASTE', 'SEWAGE', 'OTHER');
ALTER TABLE "Complaint" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;
