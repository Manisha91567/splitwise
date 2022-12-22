const Member = require('../models/Members');


async function addMember (data,id ) {
    try{
    const result = await Member.create({
        groupId : data.groupId,
        name: data.name,
        email: data.email,
        createdBy: id
       
      });
      return { success: true, body: result };
    }catch ( err ) {
      if(err.code == 11000){
        return {success: false ,message :"Email already exists in this group"}
      }else{
        console.log(err.stack);
      return { success: false, error: err  };
      }
      }
  };

  async function getMember (data) {
    try{
      
    const result = await Member.find({ groupId : data.id });
    console.log(data);
      return { success: true, body: result };
    }catch ( err ) {
        console.log(err.stack);
        return { success: false, error: err };
      }
  };

module.exports = {addMember , getMember};