const rescue = require('express-rescue');

const { productsServices } = require('../services');

const getAll = rescue(
  async (req, res, next) => {
    const products = await productsServices.getAll();
    res.status(200).json({
      products
    })
})

module.exports = {
  getAll,
};
