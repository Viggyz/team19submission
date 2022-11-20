import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
// import {TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs from 'dayjs';
function EventForm({location}) {
  const [eventName, setEventName] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [description, setDescription] = useState();
  const [max_people, setMax_people] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  useEffect(()=>{
    setCurrentLocation(location);
  },[location])
  return (
    <div className='eventform'>
      <div className='event-add'>Add</div>
      <div className='event-name'>
        <div className='event-name-label'>Name</div>
        <TextField onChange={(evt)=>setEventName(evt.target.value)}/>
      </div>
      <div className='event-name'>
      <div className='event-name-label'>Start When</div>  
      <TextField type="datetime-local"   

        sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }} onChange={(evt)=>{setStartTime(evt.target.value); console.log(evt.target.value)}}/>

      </div>
      <div className='event-name'>
        <div className='event-name-label'>End Time</div>
        <TextField type="datetime-local"   

sx={{ width: 250 }}
InputLabelProps={{
  shrink: true,
}} onChange={(evt)=>{setEndTime(evt.target.value); console.log(evt.target.value)}}/>
      </div>
      <div className='event-name'>
        <div className='event-name-label'>Description</div>
        <TextField onChange={(evt)=>setDescription(evt.target.value)}/>
      </div>
      <div className='event-name'>
        <div className='event-name-label'>Max People</div>
        <TextField onChange={(evt)=>setMax_people(evt.target.value)}/>
      </div>
    </div>
  )
}

export default EventForm