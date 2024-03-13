import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

export const checkPhoneNumberExist = async (phoneNumber: string) => {
  const userAlreadyExist = await prisma.user.findFirst({
    where: {
      phoneNumber,
    },
  });
  if (userAlreadyExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Phone Number Already Exist');
  }
};
export const checkNationalIdExist = async (nationalId: string) => {
  const userAlreadyExist = await prisma.user.findFirst({
    where: {
      nationalId,
    },
  });
  if (userAlreadyExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'National Id Already Exist');
  }
};

export const checkEmailExist = async (email: string) => {
  const userAlreadyExist = await prisma.personalInfo.findFirst({
    where: {
      email,
    },
  });
  if (userAlreadyExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email Already Exist');
  }
};
