var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String ,
    validate:{
      validator : function(v){
        return /[a-zA-Z]/.test(v);
      },
      message: "Please enter valid name"
   },
  required: [true, "name required"]
    },
  email: {
    type: String,
    lowercase: true,
    validate: {
        validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email"
    },
},
groupId :{
  type: Schema.Types.ObjectId,
  ref: "Group",
},
createdBy: {
  type: Schema.Types.ObjectId,
  ref: "User"
} 
},
{timestamps : true}
);

schema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  return obj;
 }


schema.index({groupId:1 , email:1} ,{unique:true });


module.exports = mongoose.model('Member', schema);