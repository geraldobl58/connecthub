/*
  Warnings:

  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Media" DROP CONSTRAINT "Media_propertyId_fkey";

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "galleryImages" TEXT[];

-- DropTable
DROP TABLE "public"."Media";
