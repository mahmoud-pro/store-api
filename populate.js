require('dotenv');

const connectDB = require('./db/connect');

const productModel = require('./models/product');
const productJsonFile = require('./products.json');

const start = (async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URL);
    await productModel.deleteMany();
    await productModel.create(productJsonFile);
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
})();
