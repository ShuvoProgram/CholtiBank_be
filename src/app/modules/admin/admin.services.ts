/* eslint-disable @typescript-eslint/ban-ts-comment */
import prisma from '../../../shared/prisma';
import { generateEmployeeId } from '../../../helpers/generateEmployeeId';
import { ICreateLoanOfficer } from './admin.interface';
import { UserHelpers } from '../../../helpers/userHelpers';
import { User, UserRole } from '@prisma/client';
import excludeFields from '../../../helpers/excludingfields';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createEmployees = async (
  token: string | undefined,
  payload: ICreateLoanOfficer,
) => {
  const verifyDecodedUser = await UserHelpers.verifyDecodedUser(token);

  if (verifyDecodedUser?.role !== UserRole.admin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to perform this action',
    );
  }

  const employeeId = generateEmployeeId('EMP_LO');

  await prisma.$transaction(async tx => {
    const userInfo = await tx.user.create({
      data: {
        role: payload.role,
        isEmployee: true,
        firstName: payload.firstName,
        lastName: payload.lastName,
        nationalId: payload.nationalId,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        pin: payload.pin,
      },
    });
    await tx.personalInfo.create({
      data: {
        userId: userInfo.id,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        maritalStatus: payload.maritalStatus,
        currentAddress: payload.currentAddress,
        permanentAddress: payload.permanentAddress,
        nationality: payload.nationality,
        email: payload.email,
      },
    });

    await tx.loanOfficer.create({
      data: {
        userId: userInfo.id,
        department: payload.department,
        hireDate: payload.hireDate,
        employeeId: employeeId,
      },
    });
  });
};

const getAllUsers = async (token: string | undefined) => {
  const verifyDecodedUser = await UserHelpers.verifyDecodedUser(token);

  if (verifyDecodedUser?.role !== UserRole.admin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to perform this action',
    );
  }

  const users = await prisma.user.findMany({
    where: {
      isEmployee: false,
      role: UserRole.user,
    },
  });
  const keysToExclude: (keyof User)[] = ['password', 'pin'];
  const updatedResult = excludeFields(users, keysToExclude);

  return updatedResult;
};

const getAllEmployees = async (token: string | undefined) => {
  const verifyDecodedUser = await UserHelpers.verifyDecodedUser(token);

  if (verifyDecodedUser?.role !== UserRole.admin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to perform this action',
    );
  }

  const users = await prisma.user.findMany({
    where: {
      isEmployee: true,
      role: {
        in: [UserRole.loan_officer, UserRole.customer_service_representative],
      },
    },
  });
  const keysToExclude: (keyof User)[] = ['password', 'pin'];
  const updatedResult = excludeFields(users, keysToExclude);

  return updatedResult;
};

const getSingleUser = async (token: string | undefined, id: string) => {
  const verifyDecodedUser = await UserHelpers.verifyDecodedUser(token);

  if (verifyDecodedUser?.role !== UserRole.admin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to perform this action',
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const keysToExclude: (keyof User)[] = ['password', 'pin'];
  const updatedResult = excludeFields(user, keysToExclude);

  return updatedResult;
};

const getAllTransactions = async (token: string | undefined) => {
  const verifyDecodedUser = await UserHelpers.verifyDecodedUser(token);
  if (verifyDecodedUser?.role !== UserRole.admin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to perform this action',
    );
  }
  const result = await prisma.transaction.findMany({
    include: {
      deposit: true,
      withdrawal: true,
      transfer: true,
    },
  });

  return result;
};

export const AdminServices = {
  createEmployees,
  getAllUsers,
  getAllEmployees,
  getSingleUser,
  getAllTransactions,
};
