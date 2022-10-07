const express = require('express');
const morgan = require('morgan');

const sportCenterRoutes = require('./routes/SportCenterRoutes');
const userRoutes = require('./routes/UserRoutes');

const app = express();

// 1) Built-in Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 2) Built-in Middlewares
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

module.exports = app;