import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { TransactionServices } from './transaction.services';

const depositMoney = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  const payload = req.body;

  const result = await TransactionServices.depositMoney(authToken, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money received successful',
    data: result,
  });
});

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  const payload = req.body;
  const result = await TransactionServices.withdrawMoney(authToken, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw Money successful',
    data: result,
  });
});

const transferMoney = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  const payload = req.body;
  const result = await TransactionServices.transferMoney(authToken, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer money successful',
    data: result,
  });
});
const mobileRecharge = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  const payload = req.body;
  const result = await TransactionServices.mobileRecharge(authToken, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mobile recharge successful',
    data: result,
  });
});



const getMyStatements = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  const result = await TransactionServices.getMyStatements(authToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Statements retrieve',
    data: result,
  });
});

export const TransactionController = {
  depositMoney,
  withdrawMoney,
  transferMoney,
  mobileRecharge,
  getMyStatements
};
