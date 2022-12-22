const multer = require("../middleware/multer");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
var mongoose = require('mongoose');
const Group = require('../models/Group');

const baseUrl = "http://localhost:8080/files/";

const mongoClient = new MongoClient("mongodb://localhost:27017/splitwiseDB");


const uploadImage = async (req, res) => {
  try {
    await multer(req, res);
    if (req.file == undefined) {
      return res.send({
        message: "You must select a image.",
      });
    }
    await mongoClient.connect();

    const database = mongoClient.db("splitwiseDB");
    const bucket = new GridFSBucket(database, {bucketName: "photos"});

    const result = await Group.find({_id : req.body.groupId});
    const id = result.map(p=>{return p.fileId}).toString();
    if(result.length != 0){
      bucket.delete(mongoose.Types.ObjectId(id));
    }

    await Group.updateOne({_id : req.body.groupId }, {$set: {fileId :req.file.id}});

    return res.send({
      message: "Image has been uploaded.",
      body: req.file
    });
    

  } catch (error) {
    console.log(error);
    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
};

const getListImage = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db("splitwiseDB");
    const images = database.collection("photos" + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);

  } catch (error) {
    return res.status(500).send({message: error.message});
  }
}

const download = async (req,res)=>{
  try{
    await mongoClient.connect();

    const database = mongoClient.db("splitwiseDB");
    const bucket = new GridFSBucket(database, {bucketName: "photos"});
    bucket.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res);

  }catch(error){
    return res.status(500).send({message: error.message});
  }
}

module.exports = {uploadImage , getListImage,download};

