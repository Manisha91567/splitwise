const Service = require('../services/services-member');

  const createMember = async (req, res) => {
    try {
      const result = await Service.addMember(req.body, req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.stack });
    }
  };

  const getAllMember = async (req, res)=>{
    try{
      const result = await Service.getMember(req.params);
      res.json(result);
    }catch(error){
      res.status(500).send({message: error.stack});
    }
  };
module.exports = {createMember , getAllMember};