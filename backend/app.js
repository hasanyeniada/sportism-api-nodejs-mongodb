const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

const sportCenterRoutes = require('./routes/sportCenterRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const AppError = require('./utils/appError');

const app = express();

// 1) Global - Built-in Middlewares

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const rateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', rateLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSql Query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Prevent Parameter Pollution
app.use(hpp());

app.use(
  hpp({
    whitelist: ['duration'],
  })
);



// 2) Custom Middlewares
app.use((req, resp, next) => {
  console.log("Hello from custom middleware...");
  next();
});
app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes
app.use('/api/v1/sportcenters', sportCenterRoutes);
app.use('/api/v1/users', userRoutes);

// 4) Unhandled Routes
app.all('*', (req, resp, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in that server!`, 404));
});

// 5) Global error handler mw
app.use(globalErrorHandler);

module.exports = app;