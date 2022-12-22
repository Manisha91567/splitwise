const Service = require('../services/services-expense');


const createExpense = async (req, res) => {
    try {
      const result = await Service.addExpenses(req.body , req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

const getExpenses = async (req, res) => {
    try {
      const result = await Service.getAllExpenses(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.stack });
    }
  };

const getBalance = async (req, res) => {
    try {
      const result = await Service.getTotalBalance(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.stack });
    }
  };


module.exports = {createExpense ,getExpenses ,getBalance };