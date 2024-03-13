import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
import { jwtHelpers } from './jwtHelpers';
import config from '../config';
import prisma from '../shared/prisma';

const verifyDecodedUser = async (token: string | undefined) => {
  const verifyToken = jwtHelpers.verifyToken(
    token as string,
    config.jwt.secret as Secret,
  );

  const decodedUserInfo = await prisma.user.findUnique({
    where: {
      id: verifyToken?.userId,
    },
  });

  if (!decodedUserInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Unauthorized');
  }
  return decodedUserInfo;
};

export const UserHelpers = {
  verifyDecodedUser,
};
