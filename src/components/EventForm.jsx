import { TextField, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
// import {TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Locations } from "../api.service";
import dayjs from "dayjs";
function EventForm({ location, setsnackBarState }) {
  const [eventName, setEventName] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [description, setDescription] = useState();
  const [max_people, setMax_people] = useState();
  const [currentLocation, setCurrentLocation] = useState();
 
  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  const handleClick = ()=>{
    Locations.createEvent(currentLocation, {"name":eventName, "start_time": startTime, "end_time": endTime, "description": description, "max_people": max_people})
    .then(()=>{setsnackbarState({open: true, message: "Event Successfully Created!", severity: "success"})})
    .catch((err)=>{setsnackbarState({open: true, message: err, severity: "error"})})
  }
  return (
    <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-around", flexDirection:"column" }} className>
     <div className="event-add">Add</div>
      <TextField label="name" className="event-textfield"  onChange={(evt) => setEventName(evt.target.value)} />
        <TextField
        className="event-textfield"
          type="datetime-local"
          label="Start When"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(evt) => {
            setStartTime(evt.target.value);
            console.log(evt.target.value);
          }}
        />
       <TextField
       className="event-textfield"
          label="End When"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(evt) => {
            setEndTime(evt.target.value);
            console.log(evt.target.value);
          }}
        />
        <TextField className="event-textfield" label="Description" onChange={(evt) => setDescription(evt.target.value)} />
        <TextField className="event-textfield" label="Max people" onChange={(evt) => setMax_people(evt.target.value)} />
        <Button type="filled" onClick={handleClick}>ADD EVENT</Button>
    {/* </div> */}
    </Box>
  );
}

export default EventForm;
