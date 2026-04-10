// const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema({

//   title:{
//     type:String,
//     required:true
//   },

//   description:{
//     type:String
//   },

//   date:{
//     type:Date,
//     required:true
//   },

//   location:{
//     type:String,
//     required:true
//   },

//   category:{
//     type:String,
//     enum:[
//       "technical",
//       "cultural",
//       "fest",
//       "sports",
//       "workshop",
//       "other"
//     ],
//     default:"other"
//   },


//   // banner image (multer file path)
//   bannerImage:{
//     type:String,
//     default:""
//   },


//   // upcoming or past
//   status:{
//     type:String,
//     enum:["upcoming","past"],
//     default:"upcoming"
//   },


//   // extra details
//   details:{

//     galleryImages:[

//       {

//         url:String,

//         caption:{
//           type:String,
//           default:""
//         }

//       }

//     ],

//     highlights:[
//       String
//     ]

//   },


//   createdAt:{
//     type:Date,
//     default:Date.now
//   }

// });



// /*
// auto change upcoming → past
// whenever event saved
// */

// eventSchema.pre("save",function(next){

//   if(new Date(this.date) < new Date()){

//     this.status="past";

//   }
//   else{

//     this.status="upcoming";

//   }

//   next();

// });


// module.exports = mongoose.model(

//   "Event",

//   eventSchema

// );
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  date: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: [
      "technical",
      "cultural",
      "fest",
      "sports",
      "workshop",
      "other",
    ],
    default: "other",
  },

  bannerImage: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["upcoming", "past"],
    default: "upcoming",
  },

  details: {
    galleryImages: [
      {
        url: String,
        caption: {
          type: String,
          default: "",
        },
      },
    ],
    highlights: [String],
    },
  participants: [
  {
    name: String,
    year: String,
    branch: String,
    email: String,
    mobile: String,
    gender: String,
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// safe pre-save hook (no next)
eventSchema.pre("save", function () {
  if (this.date) {
    this.status =
      new Date(this.date) < new Date() ? "past" : "upcoming";
  }
});

module.exports = mongoose.model("Event", eventSchema);