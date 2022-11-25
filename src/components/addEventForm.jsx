import { 
  Modal,
  Paper,
  Box,
} from "@mui/material";

import EventForm from './EventForm';

function AddEventForm({
  openEventModal,
  handleEventClose, 
  currentLocation, 
  setsnackbarState,
  userCity,
  currentEvent,
}) {
    return (
      <Modal
      sx={{margin: {xs: "1rem", md: 0}}}
      open={openEventModal}
      onClose={handleEventClose}
    >
      <Box>
        <Paper 
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                boxShadow: 24,
                padding: '1rem',
            }}
        >
        <EventForm 
          location={currentLocation} 
          setsnackbarState={setsnackbarState}
          handleEventClose={handleEventClose}
          userCity={userCity}
          currentEvent={currentEvent}
        /> 
          
        </Paper>
      </Box>
    </Modal>
    
    )
          }

export default AddEventForm