import express, { type Request, type Response } from 'express';
import userRouter from './routes/userRouter.ts';
import domainRouter from './routes/domainRouter.ts';
import hrRouter from './routes/hrRouter.ts';
import driveAttendiesRouter from './routes/driveAttendiesRouter.ts';
import interveiwPostRouter from './routes/interveiwPostRouter.ts';
import adminRouter from './routes/adminRouter.ts';
import cors, { type CorsOptions } from 'cors';

const app = express();

const corsOptions: CorsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '100kb' }));

/* routes declaration */
//  User routes
app.use('/api/user', userRouter);

// domain routes
app.use('/api/domain', domainRouter);

// hr routes
app.use('/api/hr', hrRouter);

// drive routes
app.use('/api/drive', driveAttendiesRouter);

// interviewPost routes
app.use('/api/post', interveiwPostRouter);

// admin routes
app.use('/api/admin', adminRouter); 

// serverHealth
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Server is 100% healthy.',
  });
});

export { app };
