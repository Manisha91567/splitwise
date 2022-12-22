const Service = require('../services/services-group');

const createGroup = async (req, res) => {
    try {
      const result = await Service.addGroup(req.body, req.user);
      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

const getGroup = async (req, res) => {
    try {
      const result = await Service.getAllGroup(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.stack });
    }
  };

const update = async (req, res) => {
    try {
      const result = await Service.updateGroup(req.params.id , req.body);
      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.stack });
    }
  };

const deleteGroup = async (req,res) =>{
  try{
    const result = await Service.deleteGroup(req.params.id);
    res.json(result);
  }catch(error){
    res.status(500).send({message: error.stack});
  }
}
  

module.exports = {createGroup ,getGroup ,update , deleteGroup};