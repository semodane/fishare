-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'ABUSE', 'FALSE_INFO', 'OTHER');

-- CreateEnum
CREATE TYPE "SuggestionTargetType" AS ENUM ('harbor', 'boat', 'place');

-- AlterTable
ALTER TABLE "Boat" ADD COLUMN     "detailScores" JSONB,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "imageUrls" JSONB,
ADD COLUMN     "mainSpecies" JSONB;

-- AlterTable
ALTER TABLE "Harbor" ADD COLUMN     "imageUrls" JSONB,
ADD COLUMN     "mainSpecies" JSONB;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "detail" JSONB,
ADD COLUMN     "imageUrls" JSONB;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "detailScores" JSONB,
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "wouldRevisit" BOOLEAN;

-- CreateTable
CREATE TABLE "ReviewReport" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "reporterId" TEXT,
    "reason" "ReportReason" NOT NULL,
    "detail" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentSuggestion" (
    "id" TEXT NOT NULL,
    "authorId" TEXT,
    "harborId" TEXT,
    "targetType" "SuggestionTargetType" NOT NULL,
    "targetId" TEXT,
    "payload" JSONB NOT NULL,
    "note" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewReport_reviewId_createdAt_idx" ON "ReviewReport"("reviewId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ReviewReport_reporterId_idx" ON "ReviewReport"("reporterId");

-- CreateIndex
CREATE INDEX "ReviewReport_status_idx" ON "ReviewReport"("status");

-- CreateIndex
CREATE INDEX "ReviewReport_deletedAt_idx" ON "ReviewReport"("deletedAt");

-- CreateIndex
CREATE INDEX "ContentSuggestion_harborId_idx" ON "ContentSuggestion"("harborId");

-- CreateIndex
CREATE INDEX "ContentSuggestion_authorId_idx" ON "ContentSuggestion"("authorId");

-- CreateIndex
CREATE INDEX "ContentSuggestion_targetType_idx" ON "ContentSuggestion"("targetType");

-- CreateIndex
CREATE INDEX "ContentSuggestion_status_idx" ON "ContentSuggestion"("status");

-- CreateIndex
CREATE INDEX "ContentSuggestion_deletedAt_idx" ON "ContentSuggestion"("deletedAt");

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSuggestion" ADD CONSTRAINT "ContentSuggestion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSuggestion" ADD CONSTRAINT "ContentSuggestion_harborId_fkey" FOREIGN KEY ("harborId") REFERENCES "Harbor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
