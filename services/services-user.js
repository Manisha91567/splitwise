const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



async function signup(data){
    try { 
      const userName = await User.findOne({ username: data.username});
      if(Boolean(userName)){
        return {success: false , message : "Username is already taken"};
      } 
      const email = await User.findOne({ email: data.email});
      if(Boolean(email)){
        return {success: false , message : "Email is already taken"};
      }
      const result = await User.create({
        username: data.username,
        email: data.email,
        password: data.password,   
      }); 
      return { success: true, body: result };
    }
    catch ( err ) {
      if(err.name == "ValidationError") {
        return {message : err.message, validationError: true };
      }
      return { success: false, error: err  };
    }
    };
  
async function signin(data){   
  try {
        const user = await User.findOne({ email: data.email});
        if (user) {
        const cmp = await bcrypt.compare(data.password, user.password);
        if (cmp) {         
          const token = jwt.sign(
            { id: user.id,  username : user.username , email: user.email},
            process.env.TOKEN_KEY,
            {
              expiresIn: "9h",
            }
          );
          return{success: true , message: "Login successful" , token};
        } else {
          return{success : false , message: "Wrong email or password."};
        }
      } else {
        return{success : false , message: "Wrong email or password."};
      }    
      }catch ( err ) {
        console.log(err.stack);
        return { success: false, error: err };
      }
      };
  
module.exports = {
  signup,
  signin,
}
