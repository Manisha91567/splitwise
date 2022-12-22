var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  groupName: {
    type: String,
    validate:{
      validator : function(v){
        return /[a-zA-Z0-9]/.test(v);
      },
      message: "Please enter valid groupname"
   },
  required: [true, "groupname required"]
  },
  groupType: {
    type: String,
    required:true,
    enum: {values: ['Home' , 'Trip' , 'Couple', 'Others' ]}
  },
  fileId:{
    type: Schema.Types.ObjectId,
    ref: 'photos.files'
  },
  createdBy: {
    type: Schema.Types.ObjectId , 
    required: true,
    ref: 'User'
  },
},
{timestamps : true}
);

schema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  return obj;
 }


module.exports = mongoose.model('Group', schema);