-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'loan_officer', 'customer_service_representative');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'inActive');

-- CreateEnum
CREATE TYPE "TransactionTypeEnum" AS ENUM ('Deposit', 'Withdrawal', 'Transfer', 'Mobile_Recharge');

-- CreateEnum
CREATE TYPE "DepositSourceEnum" AS ENUM ('bank_transfer', 'credit_card', 'atm', 'agent');

-- CreateEnum
CREATE TYPE "WithdrawSourceEnum" AS ENUM ('agent', 'atm');

-- CreateEnum
CREATE TYPE "TransferSourceEnum" AS ENUM ('Cholti_to_Cholti', 'NPSB', 'EFT', 'RTGS', 'Cash_by_code', 'BKash', 'Nagad', 'Prepaid_Card', 'Binimoy');

-- CreateEnum
CREATE TYPE "SimTypeEnum" AS ENUM ('Prepaid', 'Postpaid');

-- CreateEnum
CREATE TYPE "MobileOperatorEnum" AS ENUM ('Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isEmployee" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "passwordChangedAt" TIMESTAMP(3),
    "pinChangeAt" TIMESTAMP(3),
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalInfo" (
    "id" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "profilePicture" TEXT,
    "gender" TEXT,
    "nationality" TEXT,
    "otherPhoneNumber" TEXT,
    "passportId" TEXT,
    "email" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "currentAddress" TEXT,
    "permanentAddress" TEXT,
    "maritalStatus" TEXT,
    "occupation" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PersonalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFinancialInfo" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalDeposit" DOUBLE PRECISION DEFAULT 0.0,
    "totalWithdraw" DOUBLE PRECISION DEFAULT 0.0,
    "totalTransfer" DOUBLE PRECISION DEFAULT 0.0,
    "totalRecharge" DOUBLE PRECISION DEFAULT 0.0,
    "accountType" TEXT NOT NULL DEFAULT 'current',
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "interestRate" DOUBLE PRECISION,
    "creditLimit" DOUBLE PRECISION,
    "overdraftLimit" DOUBLE PRECISION,
    "withdrawalLimit" DOUBLE PRECISION,
    "investmentPortfolio" TEXT,
    "creditScore" INTEGER,
    "accountOpeningDate" TIMESTAMP(3),
    "lastUpdatedDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserFinancialInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceInfo" (
    "id" TEXT NOT NULL,
    "devicesId" TEXT,
    "devicesModel" TEXT,
    "devicesType" TEXT,
    "devicesVendor" TEXT,
    "browserName" TEXT,
    "browserVersion" TEXT,
    "engineName" TEXT,
    "engineVersion" TEXT,
    "osName" TEXT,
    "osVersion" TEXT,
    "cpuArchitecture" TEXT,
    "agentClient" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeviceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "depositSource" "DepositSourceEnum" NOT NULL,
    "bankName" TEXT,
    "bankAccountNo" TEXT,
    "creditCardName" TEXT,
    "creditCardNumber" TEXT,
    "atmId" TEXT,
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "withdrawSource" "WithdrawSourceEnum" NOT NULL,
    "atmId" TEXT,
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transferSource" "TransferSourceEnum" NOT NULL,
    "bankName" TEXT,
    "bankAccountNo" TEXT,
    "receiverName" TEXT,
    "receiverId" TEXT,
    "receiverNID" TEXT,
    "phoneNumber" TEXT,
    "bankBranch" TEXT,
    "reference" TEXT,
    "cashByCodePIN" TEXT,
    "creditCardName" TEXT,
    "creditCardNumber" TEXT,
    "atmId" TEXT,
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileRecharge" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mobileOperators" "MobileOperatorEnum" NOT NULL,
    "simType" "SimTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileRecharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "transactionType" "TransactionTypeEnum" NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "depositId" TEXT,
    "withdrawalId" TEXT,
    "transferId" TEXT,
    "mobileRechargeId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "status" "LoanStatus" NOT NULL,
    "loanOfficerId" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanOfficer" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LoanOfficer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "User"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_userId_key" ON "PersonalInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFinancialInfo_accountNumber_key" ON "UserFinancialInfo"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserFinancialInfo_userId_key" ON "UserFinancialInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceInfo_userId_key" ON "DeviceInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_transactionId_key" ON "Deposit"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_transactionId_key" ON "Withdrawal"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_transactionId_key" ON "Transfer"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileRecharge_transactionId_key" ON "MobileRecharge"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionId_key" ON "Transaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_depositId_key" ON "Transaction"("depositId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_withdrawalId_key" ON "Transaction"("withdrawalId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transferId_key" ON "Transaction"("transferId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_mobileRechargeId_key" ON "Transaction"("mobileRechargeId");

-- CreateIndex
CREATE UNIQUE INDEX "LoanOfficer_employeeId_key" ON "LoanOfficer"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "LoanOfficer_userId_key" ON "LoanOfficer"("userId");

-- AddForeignKey
ALTER TABLE "PersonalInfo" ADD CONSTRAINT "PersonalInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFinancialInfo" ADD CONSTRAINT "UserFinancialInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceInfo" ADD CONSTRAINT "DeviceInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "Transfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_mobileRechargeId_fkey" FOREIGN KEY ("mobileRechargeId") REFERENCES "MobileRecharge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_loanOfficerId_fkey" FOREIGN KEY ("loanOfficerId") REFERENCES "LoanOfficer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanOfficer" ADD CONSTRAINT "LoanOfficer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
