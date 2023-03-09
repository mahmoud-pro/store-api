require('dotenv').config();
require('express-async-errors');

// express app
const express = require('express');
const app = express();

// database
const connectDB = require('./db/connect');

// router
const productsRouter = require('./router/products');
app.use('/api/v1/products', productsRouter);

// error pages & middleware
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extends: false }));
app.use(notFound);
app.use(errorHandler);

// server
const PORT = 5000 || process.env.PORT;
const start = (async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, console.log(`server is listing on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
})();
