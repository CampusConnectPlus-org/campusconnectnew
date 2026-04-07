const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Admin = require("../models/Admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const verifyToken = require("../middleware/verifyToken");


// admin login api
router.post("/admin", async (req,res)=>{

const {email,password} = req.body;

const admin = await Admin.findOne({email});

if(!admin){
return res.json({message:"admin not found"});
}

const isMatch = await bcrypt.compare(password,admin.password);

if(!isMatch){
return res.json({message:"Wrong password"});
}

const token = jwt.sign(
{id:admin._id,
    role:"admin"
},
"secretkey",
{expiresIn:"1d"}
);

res.json({
token,
admin:{
name:admin.name,
email:admin.email,
profileImage:admin.profileImage
}
});

});
// LOGIN API
router.post("/login", async (req,res)=>{

const {enrollmentNumber,password} = req.body;

const user = await User.findOne({enrollmentNumber});

if(!user){
return res.json({message:"User not found"});
}

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
return res.json({message:"Wrong password"});
}

const token = jwt.sign(
{id:user._id,
    role:user.role
},
"secretkey",
{expiresIn:"1d"}
);

res.json({
token,
user:{
name:user.name,
enrollmentNumber:user.enrollmentNumber,
email:user.email,
profileImage:user.profileImage
}
});

});



module.exports = router;