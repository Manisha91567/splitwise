var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var schema = new Schema({
  username: { 
    type: String,
     unique: [true,"Username is taken"],
     validate:{
        validator : function(v){
          return /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(v);
          //username is 8-20 characters long
          //no _ or . at the beginning
          //no __ or _. or ._ or .. inside
          //allowed characters ,no _ or . at the end
        },
        message: "Please enter valid username"
     },
    required: [true, "username required"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: [true,"email is taken"],
    validate: {
        validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email"
    },
    required: [true, "Email required"]
},
  password: { 
    type: String,
    validate:{
      validator: function(v){
     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(v);
     //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  },
  message: "please enter valid password"
},
    required: [true, "password required"] 
  },
  
});

schema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  return obj;
 }

schema.pre('save' , function(next) {
  const user =this;
  if (this.password && this.isModified("password") ) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function(hashError, hash) {
          if (hashError) {
            return next(hashError)
          }
          user.password = hash
          next();
        })
      }
    })
  } else {
    return next();
  }
},
{timestamps : true}
);


module.exports = mongoose.model('User', schema);


