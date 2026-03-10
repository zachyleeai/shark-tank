-- CreateEnum
CREATE TYPE "FeaturePriority" AS ENUM ('P1', 'P2', 'P3');

-- CreateEnum
CREATE TYPE "FeatureStatus" AS ENUM ('IDEA', 'PLANNED', 'IN_DEV', 'SHIPPED');

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problem" TEXT,
    "user" TEXT,
    "value" TEXT,
    "priority" "FeaturePriority" NOT NULL DEFAULT 'P2',
    "status" "FeatureStatus" NOT NULL DEFAULT 'IDEA',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_name_key" ON "App"("name");

-- CreateIndex
CREATE INDEX "Feature_appId_idx" ON "Feature"("appId");

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
