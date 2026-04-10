const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");
const Event = require("../models/Event");


// CREATE EVENT
// router.post(
// "/create",
// upload.single("bannerImage"),
// async (req,res)=>{

// try{

// console.log("BODY:",req.body);
// console.log("FILE:",req.file);

// const newEvent = new Event({

// title:req.body.title,

// date:req.body.date,

// location:req.body.location,

// category:req.body.category,

// bannerImage:req.file?.filename

// });

// await newEvent.save();

// res.status(201).json({
// success:true,
// message:"event created",
// data:newEvent
// });

// }

// catch(error){

// console.log("ERROR:",error);

// res.status(500).json({
// success:false,
// message:error.message
// });

// }

// });
router.post(
"/create",
upload.single("bannerImage"),
async (req,res)=>{

try{

console.log("BODY:",req.body);
console.log("FILE:",req.file);

const newEvent = new Event({

title:req.body.title,

date:new Date(req.body.date),

location:req.body.location,

category:req.body.category,

bannerImage:req.file
? req.file.path
        : "",
details:{
galleryImages:[],
highlights:[]
}

});

await newEvent.save();

res.status(201).json({
success:true,
data:newEvent
});

}

catch(error){

console.log("FULL ERROR ↓");

console.log(error);

console.log("ERROR MESSAGE ↓");

console.log(error.message);

console.log("ERROR STACK ↓");

console.log(error.stack);

res.status(500).json({
message:error.message
});

}

});




// ADD MULTIPLE GALLERY IMAGES
router.post(
  "/gallery/:id",

  upload.array("images",10),

  async(req,res)=>{

    try{

      const images = req.files.map(

        file=>({

          url:file.path,

          caption:""

        })

      );


      const event = await Event.findByIdAndUpdate(

        req.params.id,

        {

          $push:{

            "details.galleryImages":{

              $each:images

            }

          }

        },

        {new:true}

      );


      res.json(event);

    }

    catch(err){

      res.status(500).json({

        error:err.message

      });

    }

  }

);




// GET ALL EVENTS
router.get(
  "/",

  async(req,res)=>{

    try{

      const events = await Event.find()
        .sort({date:1});

      res.json(events);

    }

    catch(err){

      res.status(500).json({

        error:err.message

      });

    }

  }

);




// DELETE EVENT
router.delete(
  "/:id",

  async(req,res)=>{

    try{

      await Event.findByIdAndDelete(

        req.params.id

      );

      res.json({

        message:"deleted"

      });

    }

    catch(err){

      res.status(500).json({

        error:err.message

      });

    }

  }

);




// EDIT EVENT (with optional new banner)
router.put(
  "/:id",

  upload.single("bannerImage"),

  async(req,res)=>{

    try{

      const updateData={

        title:req.body.title,

        description:req.body.description,

        date:new Date(req.body.date),

        location:req.body.location,

        category:req.body.category,

        "details.highlights":

          req.body.highlights || []

      };


      if(req.file){

        updateData.bannerImage=req.file.path;

      }


      const updated = await Event.findByIdAndUpdate(

        req.params.id,

        updateData,

        {new:true}

      );


      res.json(updated);

    }

    catch(err){

      res.status(500).json({

        error:err.message

      });

    }

  }

);

// PARTICIPATE IN EVENT
router.post("/register/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    const participant = {
      name: req.body.name,
      year: req.body.year,
      branch: req.body.branch,
      email: req.body.email,
      mobile: req.body.mobile,
      gender: req.body.gender,
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $push: {
          participants: participant,
        },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration successful",
      data: updatedEvent,
    });
  } catch (err) {
    console.log("REGISTRATION ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;