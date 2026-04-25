const mongoose=require("mongoose");

const complaintSchema = new mongoose.Schema({

userName:String,

userEmail:String,

enrollment:String,

department:String,

complaintText:{
type:String,
required:true
},

anonymous:{
type:Boolean,
default:false
},

status:{
type:String,
default:"Pending"
},

createdAt:{
type:Date,
default:Date.now
}

});

module.exports=
mongoose.model(
"Complaint",
complaintSchema
);