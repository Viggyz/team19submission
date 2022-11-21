import { TextField, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import {TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Locations } from "../api.service";

function EventForm({ location, setsnackbarState, handleEventClose, userCity }) {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [description, setDescription] = useState("");
  const [max_people, setMax_people] = useState(1);



  const handleClick = ()=>{
    let locationWithCity = {
      ...location,
      address: {
        city: userCity,
        ...location.address
      }
    }
    
    Locations.createEvent(locationWithCity, {
      name: eventName,
      start_time: startTime,
      end_time: endTime,
      description, 
      max_people,
    })
    .then(() => {
        setsnackbarState({open: true, message: "Event Successfully Created!", severity: "success"});
        handleEventClose();
    })
    .catch((err) => setsnackbarState({open: true, message: "Unable to create event", severity: "error"}))
  }
  return (
    <Box sx={{display:"flex", alignItems:"center", justifyContent:"around", flexDirection:"column" }} className="parent">
      <Typography variant="h5">Create New Event</Typography>
      <TextField  error ={eventName.length !== 0 ? false : true } label="Event Name" className="event-textfield"  onChange={(evt) => setEventName(evt.target.value)} />
        <TextField
        error ={ startTime.length !== 0 ? false : true }
        className="event-textfield"
          type="datetime-local"
          label="Start Time"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(evt) => {
            setStartTime(evt.target.value);
          }}
        />
       <TextField
        error ={ endTime.length !== 0 ? false : true }
        
       className="event-textfield"
          label="End Time"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(evt) => {
            setEndTime(evt.target.value);
          }}
        />
        <TextField className="event-textfield" label="Description" onChange={(evt) => setDescription(evt.target.value)} />
        <TextField className="event-textfield" error={max_people>0?false:true} defaultValue={max_people}  type="number" label="Max people" onChange={(evt) => setMax_people(evt.target.value)} />
        <Button variant="contained"   onClick={handleClick} sx={{marginBottom: "1rem"}}>ADD EVENT</Button>
    {/* </div> */}
    </Box>
  );
}

export default EventForm;
