import React, { useEffect } from 'react'
import {Link, Modal, Paper,Box, TextField, Button, Typography} from "@mui/material";
import EventForm from './EventForm';
function AddEventForm({
  openEventModal,
  handleEventClose, 
  currentLocation, 
  setsnackbarState,
  userCity,
}) {
    return (
      <Modal
    open={openEventModal}
    onClose={handleEventClose}>
      <Box>
        <Paper 
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                // bgcolor: 'background.paper',
                // border: '2px solid #000',
                boxShadow: 24,
                padding: '1rem',
            }}
        >
        <EventForm 
          location={currentLocation} 
          setsnackbarState={setsnackbarState}
          handleEventClose={handleEventClose}
          userCity={userCity}
        /> 
          
        </Paper>
      </Box>
    </Modal>
    
    )
          }

export default AddEventForm