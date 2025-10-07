/*
  Warnings:

  - You are about to alter the column `area` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_propertyId_fkey";

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "address" JSONB,
ALTER COLUMN "area" SET DATA TYPE DECIMAL(10,2);

-- DropTable
DROP TABLE "public"."Address";

-- CreateIndex
CREATE INDEX "Property_tenantId_status_type_createdAt_idx" ON "public"."Property"("tenantId", "status", "type", "createdAt");
