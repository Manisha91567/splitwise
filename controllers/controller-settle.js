const Service = require('../services/service-settle');


const createSettleAmount = async (req,res) =>{
    try{
        const result = await Service.addSettleAmount(req.body ,req.user.id );
        res.json(result);
    }catch(error){
        res.status(500).send(error);
    }
}

module.exports = {createSettleAmount};