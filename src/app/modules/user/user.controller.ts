import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { UserServices } from './user.services';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;

  const result = await UserServices.getMyProfile(authToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieve successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  const payload = req.body;
  const result = await UserServices.updateMyProfile(authToken, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data updated successfully',
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
};
