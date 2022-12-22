const Group = require('../models/Group');
const Member = require('../models/Members');
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
var mongoose = require('mongoose');

const mongoClient = new MongoClient("mongodb://localhost:27017/splitwiseDB");

async function addGroup (data , user) {
    try{
    const result = await Group.create({
        groupName: data.groupName,     
        groupType : data.groupType,
        fileId: data.fileId,
        createdBy: user.id    
      });
    const obj = {name: user.username , email: user.email , createdBy: user.id };
    data.groupMembers.unshift(obj);
    data.groupMembers.forEach(item => {return item.groupId = result._id });
    await Member.insertMany(data.groupMembers);
    
      return { success: true, body: result };
    }catch ( err ) {
        console.log(err.stack);
        return { success: false, error: err };
    }
};

async function getAllGroup () {
  try{
  const result = await Group.find().limit(2);
  return { success: true, body: result };
  }catch ( err ) {
      console.log(err.stack);
      return { success: false, error: err };
    }
};

async function updateGroup (id, data){
  try{
    const result = await Group.findByIdAndUpdate(id ,data,{new:true});

    data.groupMembers.forEach(item => {return item.groupId = id});
    await Member.insertMany(data.groupMembers);

    return {success: true, body: result};
  }catch(err){
    console.log(err.stack);
    return {success: false , error :err};
  }
};

async function deleteGroup (id){
  try{
    const result = await Group.find({_id:id});
    if(result.length == 0){
      return{message: "This group doesn't exists"};
    }
    await Group.findByIdAndRemove(id);
    await Member.deleteMany({groupId : id});

    await mongoClient.connect();

    const database = mongoClient.db("splitwiseDB");
    const bucket = new GridFSBucket(database, {bucketName: "photos"});

    const fileId = result.map(p=>{return p.fileId}).toString();
    if(result.length != 0){
      bucket.delete(mongoose.Types.ObjectId(fileId));
    }

    return {success: true, message: "Group is deleted"};
  }catch(err){
    console.log(err.stack);
    return {success: false , error :err};
  }
};


module.exports = { addGroup , getAllGroup ,updateGroup ,deleteGroup};