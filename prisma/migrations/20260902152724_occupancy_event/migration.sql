-- CreateTable
CREATE TABLE "OccupancyEvent" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "OccupancyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OccupancyEvent_familyId_startedAt_idx" ON "OccupancyEvent"("familyId", "startedAt");

-- AddForeignKey
ALTER TABLE "OccupancyEvent" ADD CONSTRAINT "OccupancyEvent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupancyEvent" ADD CONSTRAINT "OccupancyEvent_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
