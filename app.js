// environment variables
require('dotenv').config();

// asynchronous errors
require('express-async-errors');

// express
const express = require('express');
const app = express();

// rest of the packages
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoutes');
const publisherRouter = require('./routes/publisherRoute');
const bookRouter = require('./routes/bookRoutes');
const borrowingRouter = require('./routes/borrowingRoutes');

// middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

// welcome
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Welcome to my library API' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/publishers', publisherRouter);
app.use('/api/books', bookRouter);
app.use('/api/borrowings', borrowingRouter);

// error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Library');
        app.listen(port, () => {
            console.log(`Server is running on ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();