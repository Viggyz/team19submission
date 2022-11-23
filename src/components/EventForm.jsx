import { TextField, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Locations, Events } from "../api.service";
import moment from "moment";

function EventForm({ location, setsnackbarState, handleEventClose, userCity , currentEvent}) {
  const now = new Date();
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(now);
  const [description, setDescription] = useState("");
  const [maxPeople, setMax_people] = useState(1);
  const [errors, setErrors] = useState({
    eventName: null,
    startTime: null,
    endTime: null,
    description: null,
    maxPeople: null,
  });

  useEffect(()=>{
    if(currentEvent){
      setEventName(currentEvent.name);
      setStartTime(currentEvent.start_time);
      setEndTime(currentEvent.end_time);
      setDescription(currentEvent.description);
      setMax_people(currentEvent.max_people);
    }
  },[currentEvent])
  function validate() {
    let errors = {};
    let now = new Date();
    if (!eventName || !eventName.length) 
      errors.eventName = "Event name cannot be empty";
    else if(eventName.length < 3) 
      errors.eventName = "Event name must be greater than 3 characters";
    if (startTime < now) {
      errors.startTime = "Cannot set an event in the past";
    }
    if(new Date(endTime) < new Date(startTime)) {
      errors.endTime = "End time cannot be before start time";
    }
    if (!description || !description.length) {
      errors.description = "Description cannot be blank";
    }
    if (maxPeople > 12) {
      errors.maxPeople = "Max people cannot be greater than 12"
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }
    setErrors({
      eventName: null,
      startTime: null,
      endTime: null,
      description: null,
      maxPeople: null,
    });
    return true;
  }

  const handleClick = ()=>{
    if (!validate()) {
      return;
    }
    
    if(currentEvent){
      Events.update(currentEvent.id,{
        ...currentEvent,
        name: eventName,
        start_time: startTime,
        end_time: endTime,
        description, 
        max_people: maxPeople,
      })      
      .then(() => {
        setsnackbarState({open: true, message: "Event Successfully Editted!", severity: "success"});
        handleEventClose();
    })
    .catch((er7r) => setsnackbarState({open: true, message: "Unable to edit event", severity: "error"}))

    }
    else{
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
        max_people: maxPeople,
      })
      .then(() => {
          setsnackbarState({open: true, message: "Event Successfully Created!", severity: "success"});
          handleEventClose();
      })
      .catch((err) => setsnackbarState({open: true, message: "Unable to create event", severity: "error"}))
   
    }
  }
  return (
    <Box sx={{display:"flex", alignItems:"center", justifyContent:"around", flexDirection:"column" }} className="parent">
      <Typography variant="h5">{currentEvent?"Edit Event":"Create New Event"}</Typography>
      <TextField  
        error={eventName.length < 3 && errors.eventName } 
        value={eventName}
        label="Event Name" 
        helperText={eventName.length < 3?!eventName?errors.eventName:"Event name must be greater than 3 characters":"" }
        className="event-textfield"  
        onChange={(evt) => setEventName(evt.target.value)} 
      />
        {/* <TextField
        
        className="event-textfield"
          type="datetime-local"
          defaultValue={startTime}
          label="Start Time"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(evt) => {
            setStartTime(evt.target.value);
          }}
        /> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Start date and time"
          value={startTime}
          onChange={(value) => {
            setStartTime(value);
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              className="event-textfield"
              error ={startTime < new Date() && errors.startTime}
              helperText={startTime < new Date() ?errors.startTime:""}
            />
          )}
        />
        <DateTimePicker
          label="End date and time"
          value={endTime}
          onChange={(value) => {
            setEndTime(value);
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              className="event-textfield"
              error ={endTime < startTime && errors.endTime}
              helperText={endTime < startTime ?errors.endTime: ""}
            />
          )}
        />
        </LocalizationProvider>
        <TextField 
          error={!description.length && errors.description}
        helperText={!description.length?errors.description:""}
        multiline
          rows={3}
          className="event-textfield" 
          label="Description" 
          value={description}
          onChange={(evt) => setDescription(evt.target.value)} 
        />
        <TextField 
          className="event-textfield" 
          error={maxPeople > 12 && errors.maxPeople} 
          defaultValue={maxPeople}  
          type="number" 
          label="Max people" 
          onChange={(evt) => setMax_people(evt.target.value)} 
          helperText={maxPeople > 12 ?errors.maxPeople:""}
        />
        <Button variant="contained"   onClick={handleClick} sx={{marginBottom: "1rem"}}>{currentEvent?"EDIT EVENT":"ADD EVENT"}</Button>
    {/* </div> */}
    </Box>
  );
}

export default EventForm;
