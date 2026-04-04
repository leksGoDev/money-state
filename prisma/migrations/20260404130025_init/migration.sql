-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'RUB', 'CNY');

-- CreateEnum
CREATE TYPE "TimingType" AS ENUM ('SINGLE', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ObligationDirection" AS ENUM ('PAY', 'RECEIVE');

-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('ACTIVE', 'DONE', 'CANCELED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "name" TEXT,
    "baseCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "categoryId" TEXT,
    "notes" TEXT,
    "timingType" "TimingType" NOT NULL,
    "singleYear" INTEGER,
    "singleMonth" INTEGER,
    "monthlyStartYear" INTEGER,
    "monthlyStartMonth" INTEGER,
    "monthlyEndYear" INTEGER,
    "monthlyEndMonth" INTEGER,
    "yearlyMonth" INTEGER,
    "yearlyStartYear" INTEGER,
    "yearlyEndYear" INTEGER,
    "sourceObligationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "categoryId" TEXT,
    "notes" TEXT,
    "timingType" "TimingType" NOT NULL,
    "singleYear" INTEGER,
    "singleMonth" INTEGER,
    "monthlyStartYear" INTEGER,
    "monthlyStartMonth" INTEGER,
    "monthlyEndYear" INTEGER,
    "monthlyEndMonth" INTEGER,
    "yearlyMonth" INTEGER,
    "yearlyStartYear" INTEGER,
    "yearlyEndYear" INTEGER,
    "sourceObligationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obligation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "categoryId" TEXT,
    "notes" TEXT,
    "direction" "ObligationDirection" NOT NULL,
    "status" "ObligationStatus" NOT NULL DEFAULT 'ACTIVE',
    "activeFromYear" INTEGER NOT NULL,
    "activeFromMonth" INTEGER NOT NULL,
    "expectedYear" INTEGER,
    "expectedMonth" INTEGER,
    "resolvedYear" INTEGER,
    "resolvedMonth" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Obligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRateSnapshot" (
    "id" TEXT NOT NULL,
    "baseCurrency" "Currency" NOT NULL,
    "ratesDate" DATE NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRateSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "fromCurrency" "Currency" NOT NULL,
    "toCurrency" "Currency" NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Income_sourceObligationId_key" ON "Income"("sourceObligationId");

-- CreateIndex
CREATE INDEX "Income_userId_timingType_idx" ON "Income"("userId", "timingType");

-- CreateIndex
CREATE INDEX "Income_userId_updatedAt_idx" ON "Income"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Income_categoryId_idx" ON "Income"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_sourceObligationId_key" ON "Expense"("sourceObligationId");

-- CreateIndex
CREATE INDEX "Expense_userId_timingType_idx" ON "Expense"("userId", "timingType");

-- CreateIndex
CREATE INDEX "Expense_userId_updatedAt_idx" ON "Expense"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Expense_categoryId_idx" ON "Expense"("categoryId");

-- CreateIndex
CREATE INDEX "Obligation_userId_status_direction_idx" ON "Obligation"("userId", "status", "direction");

-- CreateIndex
CREATE INDEX "Obligation_userId_expectedYear_expectedMonth_idx" ON "Obligation"("userId", "expectedYear", "expectedMonth");

-- CreateIndex
CREATE INDEX "Obligation_userId_updatedAt_idx" ON "Obligation"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Obligation_categoryId_idx" ON "Obligation"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRateSnapshot_baseCurrency_ratesDate_key" ON "ExchangeRateSnapshot"("baseCurrency", "ratesDate");

-- CreateIndex
CREATE INDEX "ExchangeRate_fromCurrency_toCurrency_idx" ON "ExchangeRate"("fromCurrency", "toCurrency");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_snapshotId_fromCurrency_toCurrency_key" ON "ExchangeRate"("snapshotId", "fromCurrency", "toCurrency");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_sourceObligationId_fkey" FOREIGN KEY ("sourceObligationId") REFERENCES "Obligation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_sourceObligationId_fkey" FOREIGN KEY ("sourceObligationId") REFERENCES "Obligation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligation" ADD CONSTRAINT "Obligation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obligation" ADD CONSTRAINT "Obligation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeRate" ADD CONSTRAINT "ExchangeRate_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "ExchangeRateSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
