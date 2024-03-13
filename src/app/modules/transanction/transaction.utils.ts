import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import prisma from '../../../shared/prisma';

export const transferValidityCheck = async (
  token: string | undefined,
  amount: number,
) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }
  const verifyToken = jwtHelpers.verifyToken(
    token as string,
    config.jwt.secret as Secret,
  );

  const decodedUserInfo = await prisma.user.findUnique({
    where: {
      id: verifyToken?.userId,
    },
    include: {
      userFinancialInfo: true,
    },
  });

  if (!decodedUserInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Unauthorized');
  }

  if (amount < 0) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Amount can't be Negative");
  }

  return decodedUserInfo;
};
