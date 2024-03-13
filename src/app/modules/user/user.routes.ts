import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';

const route = express.Router();

route.get(
  '/my-profile',
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.LOAN_OFFICER,
    ENUM_USER_ROLE.CUSTOMER_SERVICE_REPRESENTATIVE,
  ),
  UserController.getMyProfile,
);
route.patch(
  '/update-my-profile',
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.LOAN_OFFICER,
    ENUM_USER_ROLE.CUSTOMER_SERVICE_REPRESENTATIVE,
  ),
  UserController.updateMyProfile,
);

export const UserRoutes = route;
