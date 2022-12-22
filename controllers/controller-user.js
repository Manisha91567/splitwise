const Service = require('../services/services-user');

const createUser = async (req, res) => {
  try {
    const result = await Service.signup(req.body); 

    if(result.validationError){
      res.status(400);
    }
    res.json(result);
  } catch (error) {
    res.status(500).send(Error);
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await Service.signin(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).send(Error);
  }
};

module.exports = {
  createUser,
  loginUser,
}