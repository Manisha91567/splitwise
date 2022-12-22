const Settle = require('../models/Settle');
const Member = require('../models/Members');

async function addSettleAmount(data ,id) {
    try {
        //validation for payer and recipient
        const payer = await Member.exists({ _id :data.payerId , groupId : data.groupId});
        const recipient = await Member.exists({ _id : data.recipientId, groupId : data.groupId });
        
        if(data.groupId != undefined){
        if (payer == null) {
            return { message: "Payer is not from the same group" };
        }
        if (recipient == null) {
            return { message: "Recipient is not from the same group" };
        }
        }

        const result = await Settle.create({
            payerId : data.payerId,
            recipientId : data.recipientId,
            settleAmount : data.settleAmount,
            groupId: data.groupId

        });
        return { success: true, message: "Amount settled", body: result };
    } catch (err) {
        console.log(err.stack);
        return { success: false, error: err }
    }
}

module.exports = { addSettleAmount };