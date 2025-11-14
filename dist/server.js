import express from 'express';
import userRouter from './routes/userRouter.js';
import domainRouter from './routes/domainRouter.js';
import hrRouter from './routes/hrRouter.js';
import driveAttendiesRouter from './routes/driveAttendiesRouter.js';
import interveiwPostRouter from './routes/interveiwPostRouter.js';
import adminRouter from './routes/adminRouter.js';
import cors from 'cors';
const app = express();
const corsOptions = {
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
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Server is 100% healthy.',
    });
});
export { app };
//# sourceMappingURL=server.js.map