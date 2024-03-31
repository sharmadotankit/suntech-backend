const jwt = require("jsonwebtoken");
require("dotenv").config();


const checkIfValidUser = (req, res, next) => {
  const header = req.headers.authorization;
  if(!header){
    return res.status(401).json({ msg: "No header, authorization denied" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    if(decoded.user){
      next();
    }
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const checkIfAdmin = (req, res, next) => {
  const header = req.headers.authorization;
  if(!header){
    return res.status(401).json({ msg: "No header, authorization denied" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log(decoded)
    if(decoded.user.role=='admin'){
      next();
    }else{
      res.status(401).json({ msg: "Unauthorized request. Only admin can update this data." });
    }
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};




module.exports = {
  checkIfValidUser,
  checkIfAdmin
};
