const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean');
const { rateLimit } = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrorHandler');

const tasksRouter = require('./routes/tasksRouter');
const userRouter = require('./routes/userRouter');

const app = express()

const limiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 30 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'you have exceeded the maximum number of requests in 24 hrs limit',
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

// Enable cors
app.use(cors())

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());


app.use('/tasks', tasksRouter)
app.use('/users', userRouter);

app.all ('*', (req, res, next) => {
    next(new AppError(`the url ${req.url} you are trying to access is not on this server`));
})

app.use(globalErrorHandler);

module.exports = app;