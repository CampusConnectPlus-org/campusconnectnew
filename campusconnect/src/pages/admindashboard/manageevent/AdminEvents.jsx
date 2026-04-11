import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminEvents.css";

const API = "http://localhost:5000/api/events";

const AdminEvents = () => {

  const [newEvent,setNewEvent] = useState({
    title:"",
    date:"",
    location:"",
    category:""
  });

  const [bannerFile,setBannerFile] = useState(null);

  const [events,setEvents] = useState([]);

  const [selectedEvent,setSelectedEvent] = useState(null);

  const [galleryFiles,setGalleryFiles] = useState([]);

  const [editEvent,setEditEvent] = useState(null);



  // load events
  useEffect(()=>{

    fetchEvents();

  },[]);


  const fetchEvents = async()=>{

    const res = await axios.get(API);

    setEvents(res.data);

  };


  // auto status
  const getStatus = (date)=>{

    return new Date(date) < new Date()

      ? "past"

      : "upcoming";

  };


  // create event
  const addEvent = async()=>{

    const formData = new FormData();

    formData.append("title",newEvent.title);

    formData.append("date",newEvent.date);

    formData.append("location",newEvent.location);

    formData.append("category",newEvent.category);

    if(bannerFile){

      formData.append(
        "bannerImage",
        bannerFile
      );

    }
  console.log("FORM DATA ↓");

  for (let pair of formData.entries()) {

    console.log(pair[0], pair[1]);

  }
    await axios.post(

      `${API}/create`,

      formData

    );

    fetchEvents();

    setNewEvent({
      title:"",
      date:"",
      location:"",
      category:""
    });

    setBannerFile(null);

  };


  // delete
  const deleteEvent = async(id)=>{

    await axios.delete(

      `${API}/${id}`

    );

    fetchEvents();

  };


  // open edit modal
  const openEditModal = (event)=>{

    setEditEvent(event);

  };


  // save edit
  const saveEdit = async()=>{

    await axios.put(

      `${API}/${editEvent._id}`,

      editEvent

    );

    fetchEvents();

    setEditEvent(null);

  };


  // open gallery modal
  const openGalleryModal = (event)=>{

    setSelectedEvent(event);

  };


  // select gallery images
  const handleGalleryFiles=(e)=>{

    setGalleryFiles(

      e.target.files

    );

  };


  // upload gallery images
  const saveGalleryImages = async()=>{

    const formData = new FormData();

    for(let file of galleryFiles){

      formData.append(

        "images",

        file

      );

    }

    await axios.post(

      `${API}/gallery/${selectedEvent._id}`,

      formData

    );

    fetchEvents();

    setSelectedEvent(null);

    setGalleryFiles([]);

  };


  const upcomingEvents = events.filter(

    event=>getStatus(event.date)==="upcoming"

  );


  const pastEvents = events.filter(

    event=>getStatus(event.date)==="past"

  );


  return (

    <div className="admin-events-container">


      <h2>Add Event</h2>

      <div className="add-event-form">

        <input
          placeholder="title"
          value={newEvent.title}
          onChange={(e)=>
            setNewEvent({
              ...newEvent,
              title:e.target.value
            })
          }
        />


        <input
          type="date"
          value={newEvent.date}
          onChange={(e)=>
            setNewEvent({
              ...newEvent,
              date:e.target.value
            })
          }
        />


        <input
          placeholder="location"
          value={newEvent.location}
          onChange={(e)=>
            setNewEvent({
              ...newEvent,
              location:e.target.value
            })
          }
        />


       <select
value={newEvent.category}
onChange={(e)=>
setNewEvent({
...newEvent,
category:e.target.value
})
}
>

<option value="">
select category
</option>

<option value="technical">
technical
</option>

<option value="cultural">
cultural
</option>

<option value="fest">
fest
</option>

<option value="sports">
sports
</option>

<option value="workshop">
workshop
</option>

<option value="other">
other
</option>

</select>


        <input
          type="file"
          onChange={(e)=>
            setBannerFile(
              e.target.files[0]
            )
          }
        />


        <button onClick={addEvent}>
          Add Event
        </button>

      </div>



      <h2>Upcoming Events</h2>

      {

        upcomingEvents.map(event=>(

          <div key={event._id} className="admin-event-card">

            <h3>{event.title}</h3>

            <p>{event.date}</p>

            <p>{event.location}</p>

            {

              event.bannerImage && (

                <img
                  className="banner-img"
                  src={`http://localhost:5000/${event.bannerImage}`}
                  alt=""
                />

              )

            }


            <button onClick={()=>openEditModal(event)}>
              edit
            </button>


            <button onClick={()=>deleteEvent(event._id)}>
              delete
            </button>


          </div>

        ))

      }



      <h2>Past Events (Moments)</h2>

      {

        pastEvents.map(event=>(

          <div key={event._id} className="admin-event-card">

            <h3>{event.title}</h3>

            <p>{event.date}</p>


            <button onClick={()=>openGalleryModal(event)}>
              upload photos
            </button>


            <button onClick={()=>deleteEvent(event._id)}>
              delete
            </button>



            <div className="image-preview">

              {

                event.details?.galleryImages?.map((img,i)=>(

                  <img
                    key={i}
                    src={`http://localhost:5000/${img.url}`}
                    alt=""
                  />

                ))

              }

            </div>


          </div>

        ))

      }



      {

        selectedEvent && (

          <div className="modal">

            <div className="modal-content">

              <h3>Upload Moments</h3>


              <input
                type="file"
                multiple
                onChange={handleGalleryFiles}
              />


              <button onClick={saveGalleryImages}>
                upload
              </button>


            </div>

          </div>

        )

      }



      {

        editEvent && (

          <div className="modal">

            <div className="modal-content">

              <h3>Edit Event</h3>


              <input
                value={editEvent.title}
                onChange={(e)=>
                  setEditEvent({
                    ...editEvent,
                    title:e.target.value
                  })
                }
              />


              <input
                type="date"
                value={editEvent.date}
                onChange={(e)=>
                  setEditEvent({
                    ...editEvent,
                    date:e.target.value
                  })
                }
              />


              <input
                value={editEvent.location}
                onChange={(e)=>
                  setEditEvent({
                    ...editEvent,
                    location:e.target.value
                  })
                }
              />


              <button onClick={saveEdit}>
                save
              </button>


            </div>

          </div>

        )

      }


    </div>

  );

};

export default AdminEvents;