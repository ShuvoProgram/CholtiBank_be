import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUserLogin } from './auth.interface';
import { IUser } from '../user/user.interface';
import { generateAccountNumber } from '../../../helpers/generateAccountNumber';
import { UserRole } from '@prisma/client';

const userSignUp = async (payload: IUser) => {
  return prisma.$transaction(async tx => {
    // checkPhoneNumberExist(payload.phoneNumber);
    // checkNationalIdExist(payload.nationalId);

    const userPhoneAlreadyExist = await prisma.user.findFirst({
      where: {
        phoneNumber: payload.phoneNumber,
      },
    });
    if (userPhoneAlreadyExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Phone Number Already Exist');
    }

    const userNationalIdAlreadyExist = await prisma.user.findFirst({
      where: {
        nationalId: payload.nationalId,
      },
    });
    if (userNationalIdAlreadyExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'NationalId Already Exist');
    }

    // Hash the password and pin asynchronously
    const hashPassword = await bcrypt.hash(
      payload.password,
      Number(config.bycrypt_salt_rounds),
    );
    const hashPin = await bcrypt.hash(
      payload.pin,
      Number(config.bycrypt_salt_rounds),
    );
    payload.password = hashPassword;
    payload.pin = hashPin;
    const user = await tx.user.create({
      data: {
        role: UserRole.user,
        ...payload,
      },
    });

    await tx.personalInfo.create({
      data: {
        userId: user.id,
      },
    });

    await tx.deviceInfo.create({
      data: {
        userId: user.id,
      },
    });

    await tx.userFinancialInfo.create({
      data: {
        accountNumber: generateAccountNumber(user.phoneNumber),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const userId = user.id;
    const role = user.role;

    const accessToken = jwtHelpers.createToken(
      { userId, role },
      config.jwt.secret as string,
      config.jwt.expires_in as string,
    );

    return accessToken;
  });
};

const loginUser = async (payload: IUserLogin) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      phoneNumber: payload.phoneNumber,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or Password Not Matching');
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isUserExist.password,
  );

  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'User or Password Not Matching',
    );
  }

  const userId = isUserExist.id;
  const role = isUserExist.role;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as string,
    config.jwt.expires_in as string,
  );

  return accessToken;
};

export const AuthServices = {
  userSignUp,
  loginUser,
};
