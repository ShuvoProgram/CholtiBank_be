import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const route = express.Router();

route.post(
  '/create-employees',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.createEmployees,
);

route.get(
  '/get-all-users',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getAllUsers,
);
route.get(
  '/get-all-employees',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getAllEmployees,
);


route.get(
  '/get-single-user/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getSingleUser,
);

route.get(
  '/all-transactions',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getAllTransactions,
);



export const AdminRoutes = route;
