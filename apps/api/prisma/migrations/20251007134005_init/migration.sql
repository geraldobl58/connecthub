-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'AGENT', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('HOUSE', 'APARTMENT', 'CONDO', 'LAND', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "public"."PropertyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RESERVED', 'SOLD', 'RENTED');

-- CreateEnum
CREATE TYPE "public"."DealStatus" AS ENUM ('OPEN', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TaskPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."StageType" AS ENUM ('SALES', 'SUPPORT');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('TEXT', 'IMAGE', 'DOC', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "public"."MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."SubStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."LeadSource" AS ENUM ('WEB', 'REFERRAL', 'SOCIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateTable
CREATE TABLE "public"."Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'AGENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."PropertyType" NOT NULL,
    "status" "public"."PropertyStatus" NOT NULL DEFAULT 'ACTIVE',
    "price" DECIMAL(12,2),
    "bedroom" INTEGER,
    "bathroom" INTEGER,
    "parking" INTEGER,
    "area" DOUBLE PRECISION,
    "features" JSONB,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "street" TEXT,
    "number" TEXT,
    "district" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Owner" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."StageType" NOT NULL DEFAULT 'SALES',
    "order" INTEGER NOT NULL,
    "isWon" BOOLEAN NOT NULL DEFAULT false,
    "isLost" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "source" "public"."LeadSource" NOT NULL DEFAULT 'WEB',
    "stageId" TEXT,
    "assignedTo" TEXT,
    "notesText" TEXT,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deal" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "status" "public"."DealStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "public"."TaskPriority" NOT NULL DEFAULT 'NORMAL',
    "assigneeId" TEXT,
    "leadId" TEXT,
    "propertyId" TEXT,
    "parentId" TEXT,
    "reminderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsAppAccount" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "webhookSecret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsAppMessage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "waAccountId" TEXT NOT NULL,
    "leadId" TEXT,
    "direction" "public"."MessageDirection" NOT NULL,
    "fromNumber" TEXT NOT NULL,
    "toNumber" TEXT NOT NULL,
    "type" "public"."MessageType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT,
    "mediaUrl" TEXT,
    "mediaMime" TEXT,
    "template" TEXT,
    "status" "public"."MessageStatus" NOT NULL DEFAULT 'SENT',
    "errorCode" TEXT,
    "errorMsg" TEXT,
    "waMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadTag" (
    "leadId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "LeadTag_pkey" PRIMARY KEY ("leadId","tagId")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "authorId" TEXT,
    "leadId" TEXT,
    "propertyId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "actorId" TEXT,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "maxUsers" INTEGER,
    "maxProperties" INTEGER,
    "maxContacts" INTEGER,
    "hasAPI" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "public"."SubStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "renewedAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertiesCount" INTEGER NOT NULL DEFAULT 0,
    "contactsCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "public"."Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_deletedAt_idx" ON "public"."Tenant"("deletedAt");

-- CreateIndex
CREATE INDEX "User_tenantId_role_isActive_idx" ON "public"."User"("tenantId", "role", "isActive");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "public"."User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_tenantId_email_key" ON "public"."User"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Property_tenantId_status_idx" ON "public"."Property"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Property_tenantId_price_idx" ON "public"."Property"("tenantId", "price");

-- CreateIndex
CREATE INDEX "Property_tenantId_type_idx" ON "public"."Property"("tenantId", "type");

-- CreateIndex
CREATE INDEX "Property_tenantId_createdAt_idx" ON "public"."Property"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Property_deletedAt_idx" ON "public"."Property"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Property_tenantId_code_key" ON "public"."Property"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Address_propertyId_key" ON "public"."Address"("propertyId");

-- CreateIndex
CREATE INDEX "Media_propertyId_isCover_order_idx" ON "public"."Media"("propertyId", "isCover", "order");

-- CreateIndex
CREATE INDEX "Owner_tenantId_name_idx" ON "public"."Owner"("tenantId", "name");

-- CreateIndex
CREATE INDEX "Owner_tenantId_email_idx" ON "public"."Owner"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Owner_tenantId_phone_idx" ON "public"."Owner"("tenantId", "phone");

-- CreateIndex
CREATE INDEX "Stage_tenantId_order_idx" ON "public"."Stage"("tenantId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_tenantId_name_key" ON "public"."Stage"("tenantId", "name");

-- CreateIndex
CREATE INDEX "Lead_tenantId_createdAt_idx" ON "public"."Lead"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_tenantId_stageId_idx" ON "public"."Lead"("tenantId", "stageId");

-- CreateIndex
CREATE INDEX "Lead_tenantId_assignedTo_idx" ON "public"."Lead"("tenantId", "assignedTo");

-- CreateIndex
CREATE INDEX "Lead_tenantId_phone_idx" ON "public"."Lead"("tenantId", "phone");

-- CreateIndex
CREATE INDEX "Lead_tenantId_email_idx" ON "public"."Lead"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Lead_deletedAt_idx" ON "public"."Lead"("deletedAt");

-- CreateIndex
CREATE INDEX "Deal_tenantId_status_idx" ON "public"."Deal"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Deal_leadId_idx" ON "public"."Deal"("leadId");

-- CreateIndex
CREATE INDEX "Deal_propertyId_idx" ON "public"."Deal"("propertyId");

-- CreateIndex
CREATE INDEX "Deal_deletedAt_idx" ON "public"."Deal"("deletedAt");

-- CreateIndex
CREATE INDEX "Task_tenantId_status_dueDate_idx" ON "public"."Task"("tenantId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "Task_assigneeId_status_dueDate_idx" ON "public"."Task"("assigneeId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "Task_deletedAt_idx" ON "public"."Task"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppAccount_tenantId_key" ON "public"."WhatsAppAccount"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppAccount_phoneNumberId_key" ON "public"."WhatsAppAccount"("phoneNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppMessage_waMessageId_key" ON "public"."WhatsAppMessage"("waMessageId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_tenantId_createdAt_idx" ON "public"."WhatsAppMessage"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_leadId_createdAt_idx" ON "public"."WhatsAppMessage"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_waAccountId_createdAt_idx" ON "public"."WhatsAppMessage"("waAccountId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tenantId_name_key" ON "public"."Tag"("tenantId", "name");

-- CreateIndex
CREATE INDEX "Note_tenantId_createdAt_idx" ON "public"."Note"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_tenantId_entity_entityId_idx" ON "public"."ActivityLog"("tenantId", "entity", "entityId");

-- CreateIndex
CREATE INDEX "ActivityLog_tenantId_createdAt_idx" ON "public"."ActivityLog"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "public"."Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_tenantId_key" ON "public"."Subscription"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Usage_tenantId_key" ON "public"."Usage"("tenantId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Owner" ADD CONSTRAINT "Owner_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Stage" ADD CONSTRAINT "Stage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsAppAccount" ADD CONSTRAINT "WhatsAppAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_waAccountId_fkey" FOREIGN KEY ("waAccountId") REFERENCES "public"."WhatsAppAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadTag" ADD CONSTRAINT "LeadTag_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadTag" ADD CONSTRAINT "LeadTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usage" ADD CONSTRAINT "Usage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
