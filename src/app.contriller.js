import authRouter from './Modules/Auth/auth.controller.js';
import userRouter from './Modules/User/user.controller.js';
import messageRouter from './Modules/Message/message.controller.js';
import connectDB from './DB/connection.js';
import { globalErrorHandler } from './Utiles/errorHandeling.utils.js';
import cors from 'cors';
import { attachRoutingWithLogger } from './Utiles/logger/logger.js'
import { corsOptions } from './Utiles/cors/cors.js';


const bootstrap = async (app, express) => {
    app.use(express.json()) // parsing body // global middleware


    app.use(cors(corsOptions()));

    await connectDB();
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