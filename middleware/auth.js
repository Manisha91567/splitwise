const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"].replace("Bearer ","");
 
  if (!token) {
    return res.status(403).json({success: false, message: "A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({success:false , message:"Invalid Token"});
  }
  return next();
};

module.exports = verifyToken;
