import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthServices } from './auth.services';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthServices.loginUser(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User signin successfully!',
    data: result,
  });
});

const userSignUp = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthServices.userSignUp(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User signin successfully!',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  userSignUp,
};
