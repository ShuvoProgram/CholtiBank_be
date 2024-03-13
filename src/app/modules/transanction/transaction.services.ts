/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { TransactionTypeEnum } from '@prisma/client';
import {
  GenerateTransactionIDEnum,
  generateTransactionId,
} from '../../../helpers/generateTransactionId';
import {
  IAddDeposit,
  IMobileRecharge,
  ITransferMoney,
  IWithdrawalMoney,
} from './transaction.interface';
import { transferValidityCheck } from './transaction.utils';
import { UserHelpers } from '../../../helpers/userHelpers';

const depositMoney = async (
  token: string | undefined,
  payload: IAddDeposit,
) => {
  const decodedUserInfo = await transferValidityCheck(token, payload.amount);

  let transactionInfo = null;

  await prisma.$transaction(async tx => {
    if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
      await tx.userFinancialInfo.update({
        where: {
          id: decodedUserInfo.userFinancialInfo.id,
        },
        data: {
          accountBalance:
            decodedUserInfo.userFinancialInfo?.accountBalance + payload.amount,
          totalDeposit: { increment: payload.amount },
        },
      });

      const deposit = await tx.deposit.create({
        data: {
          transactionId: generateTransactionId(
            GenerateTransactionIDEnum.Deposit,
          ),
          ...payload,
        },
      });

      transactionInfo = await tx.transaction.create({
        data: {
          userId: decodedUserInfo.id,
          transactionId: deposit.transactionId,
          transactionType: TransactionTypeEnum.Deposit,
          reference: payload?.reference,
          depositId: deposit.id,
        },
        include: {
          deposit: true,
        },
      });

      // const isPinMatch = await bcrypt.compare(
      //   payload.pin,
      //   decodedUserInfo.pin,
      // );

      // if (!isPinMatch) {
      //   throw new ApiError(
      //     httpStatus.UNAUTHORIZED,
      //     'User or Password Not Matching',
      //   );
      // }
    }
  });
  return transactionInfo;
};

const withdrawMoney = async (
  token: string | undefined,
  payload: IWithdrawalMoney,
) => {
  const decodedUserInfo = await transferValidityCheck(token, payload.amount);

  let transactionInfo = null;
  await prisma.$transaction(async tx => {
    if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
      const userBalanceAfterTransfer =
        decodedUserInfo.userFinancialInfo.accountBalance - payload.amount;

      if (userBalanceAfterTransfer < 0) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Insufficient Balance');
      }

      await tx.userFinancialInfo.update({
        where: {
          id: decodedUserInfo.userFinancialInfo?.id,
        },
        data: {
          accountBalance: userBalanceAfterTransfer,
          totalWithdraw: { increment: payload.amount },
        },
      });

      const withdraw = await tx.withdrawal.create({
        data: {
          transactionId: generateTransactionId(
            GenerateTransactionIDEnum.Withdrawal,
          ),
          ...payload,
        },
      });

      transactionInfo = await tx.transaction.create({
        data: {
          userId: decodedUserInfo.id,
          transactionId: withdraw.transactionId,
          transactionType: TransactionTypeEnum.Withdrawal,
          reference: payload.reference,
          withdrawalId: withdraw.id,
        },
      });
    }
  });

  return transactionInfo;
};

const transferMoney = async (
  token: string | undefined,
  payload: ITransferMoney,
) => {
  const decodedUserInfo = await transferValidityCheck(token, payload.amount);

  let transactionInfo = null;
  await prisma.$transaction(async tx => {
    if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
      const userBalanceAfterTransfer =
        decodedUserInfo.userFinancialInfo.accountBalance - payload.amount;

      if (userBalanceAfterTransfer < 0) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Insufficient Balance');
      }

      if (payload.transferSource === 'Cholti_to_Cholti') {
        const receiver = await tx.userFinancialInfo.update({
          where: {
            accountNumber: payload.bankAccountNo,
          },
          data: {
            accountBalance: { increment: payload.amount },
          },
        });

        payload.receiverId = receiver.userId;
      }

      await tx.userFinancialInfo.update({
        where: {
          id: decodedUserInfo.userFinancialInfo?.id,
        },
        data: {
          accountBalance: userBalanceAfterTransfer,
          totalTransfer: { increment: payload.amount },
        },
      });

      const transfer = await tx.transfer.create({
        data: {
          transactionId: generateTransactionId(
            GenerateTransactionIDEnum.Transfer,
          ),
          ...payload,
        },
      });

      transactionInfo = await tx.transaction.create({
        data: {
          userId: decodedUserInfo.id,
          transactionId: transfer.transactionId,
          transactionType: TransactionTypeEnum.Transfer,
          reference: payload.reference,
          transferId: transfer.id,
        },
      });
    }
  });

  return transactionInfo;
};

const mobileRecharge = async (
  token: string | undefined,
  payload: IMobileRecharge,
) => {
  const decodedUserInfo = await transferValidityCheck(token, payload.amount);

  let transactionInfo = null;
  await prisma.$transaction(async tx => {
    if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
      const userBalanceAfterTransfer =
        decodedUserInfo.userFinancialInfo.accountBalance - payload.amount;

      if (userBalanceAfterTransfer < 0) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Insufficient Balance');
      }

      await tx.userFinancialInfo.update({
        where: {
          id: decodedUserInfo.userFinancialInfo?.id,
        },
        data: {
          accountBalance: userBalanceAfterTransfer,
          totalRecharge: { increment: payload.amount },
        },
      });

      const mobileRecharge = await tx.mobileRecharge.create({
        data: {
          transactionId: generateTransactionId(
            GenerateTransactionIDEnum.Mobile_Recharge,
          ),
          ...payload,
        },
      });

      transactionInfo = await tx.transaction.create({
        data: {
          userId: decodedUserInfo.id,
          transactionId: mobileRecharge.transactionId,
          transactionType: TransactionTypeEnum.Mobile_Recharge,
          reference: 'Mobile Recharge',
          mobileRechargeId: mobileRecharge.id,
        },
      });
    }
  });

  return transactionInfo;
};

const getMyStatements = async (token: string | undefined) => {
  const verifyDecodedUser = await UserHelpers.verifyDecodedUser(token);

  const result = await prisma.transaction.findMany({
    where: {
      userId: verifyDecodedUser?.id,
    },
    include: {
      deposit: true,
      withdrawal: true,
      transfer: true,
    },
  });

  return result;
};

export const TransactionServices = {
  depositMoney,
  withdrawMoney,
  transferMoney,
  mobileRecharge,
  getMyStatements,
};
