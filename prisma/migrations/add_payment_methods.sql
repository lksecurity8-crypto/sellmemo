// Prisma migration file - copy to prisma/migrations/add_payment_methods

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountHolder" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_type_key" ON "payment_methods"("type");

-- Insert initial payment methods
INSERT INTO "payment_methods" ("id", "type", "name", "accountHolder", "accountNumber", "isActive", "createdAt", "updatedAt")
VALUES
  ('orange-money-1', 'orange_money', 'Orange Money Sénégal', 'Tchoupe Ngassa Daniella', '692860695', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mtn-money-1', 'mtn_mobile_money', 'MTN Mobile Money Sénégal', 'Tchoupe Ngassa Daniella', '652591205', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
