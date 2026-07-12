-- AlterTable
ALTER TABLE "PendingUser" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "PendingUser_email_idx" ON "PendingUser"("email");

-- CreateIndex
CREATE INDEX "PendingUser_token_idx" ON "PendingUser"("token");
