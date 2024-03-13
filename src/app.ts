import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import routes from './app/routes';

import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

import http from 'http';
import { Server } from 'socket.io';

const app: Application = express();
app.use(cookieParser());
//  parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https:example.vercel.app',
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowed list or is undefined (for same-origin requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies)
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.io = io; // Make 'io' accessible in routes
  next();
});

app.use('/api/v1', routes);
// Attach the Socket.IO instance to the Express app
app.set('socketio', io);

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default server; // Export the 'server' instance
