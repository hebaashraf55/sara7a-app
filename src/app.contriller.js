import authRouter from './Modules/Auth/auth.controller.js';
import userRouter from './Modules/User/user.controller.js';
import messageRouter from './Modules/Message/message.controller.js';
import connectDB from './DB/connection.js';
import { globalErrorHandler } from './Utiles/errorHandeling.utils.js';
import cors from 'cors';
import { attachRoutingWithLogger } from './Utiles/logger/logger.js'
import { corsOptions } from './Utiles/cors/cors.js';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'; 

const bootstrap = async (app, express) => {
    app.use(express.json()) 
    app.use(helmet()); 
    app.use(cors(corsOptions()));

    await connectDB();

    const limiter = rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        limit: 3, // 
        // standardHeaders: 'draft-8', 
        // legacyHeaders: false, 
        message: {
            status : 429,
            message : 'Too many requests, please try again later'},
        handler: (req, res, next, options) => {
            console.log("🚨 Rate limit triggered for:", req.ip);
            res.status(options.statusCode).send(options.message);
        }
    })
    // Apply the rate limiting middleware to all requests.
    app.use(limiter)

    attachRoutingWithLogger(app, '/api/auth', authRouter, 'auth.log')
    attachRoutingWithLogger(app, '/api/user', userRouter, 'user.log')
    attachRoutingWithLogger(app, '/api/message', messageRouter, 'message.log')



    app.use('/uploads', express.static('./src/uploads'))
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/message', messageRouter);


    app.all('/*dummy', (req, res) => {
        return next(new Error("not found handeler", {cause : 404}))
    }) 

     // global error handler middleware
    app.use(globalErrorHandler)
}

export default bootstrap;