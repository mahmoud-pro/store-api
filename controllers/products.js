const product = require('../models/product');

const getAllProducts = async (req, res) => {
  const { featured, company, name, sorted, fields, numericFilters } = req.query;

  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  let result = product.find(queryObject);

  if (sorted) {
    const sortList = sorted.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
    };
    const regEX = /\b(>|>=|<|<=|=)\b/g;

    let filters = numericFilters.replace(
      regEX,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((element) => {
      const [field, oprator, value] = element.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [oprator]: Number(value) };
      }
    });

    console.log(queryObject);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ products, nHits: products.length });
};

module.exports = { getAllProducts };
