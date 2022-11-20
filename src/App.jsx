import { useEffect, useState } from "react";
import "./App.css";

import { Button, Box, Snackbar, Alert } from "@mui/material";

import MapComponent from "./components/mapComponent";
import SearchBar  from "./components/searchBar";
import EventsBlock from "./components/eventBlock";
import AuthModal from "./components/authModal";
import AddEventForm from "./components/addEventForm"
import { Locations } from "./api.service";

function App() {
  const [userCoords, setUserCoords] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentEvents, setCurrentEvents] = useState(null);
  const [openEventModal, setOpenEventModal] = useState(false)

  const handleEventOpen = () => setOpenEventModal(true);
  const handleEventClose = () => setOpenEventModal(false);

  const [snackbarState, setsnackbarState] = useState({
    open: false,
    message: "",
    severity: ""
  })
  const [isSignup, setIsSignUp] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  function callEventsAPI(location) {
    if(location) {
      Locations.events(location)
      .then(data => {
        return setCurrentEvents(data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setCurrentEvents([])
        }
      })
    }
  }
  
  function handleMarkerClick(location) {
    if(location) {
      setCurrentLocation(location);
      callEventsAPI(location);
    }
  }
 
  const handleOpen = () => setOpenAuthModal(true);
  const handleClose = () => setOpenAuthModal(false);
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setsnackbarState({
      ...snackbarState,
      open:false
    });
  };

  
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  

  useEffect(() => {
    setUserCoords({longitude: '77.5946',latitude: '12.9716'});
  }, []);
  return (
    <div className="map-wrap">
      <Snackbar 
        sx={{zIndex: '10'}}
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        // message={snackbarState.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} sx={{ width: '100%' }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
      <MapComponent
        userCoords={userCoords}
        setIsSignUp={setIsSignUp}
        handleMarkerClick={handleMarkerClick}
      ></MapComponent>
      <SearchBar setUserCoords={setUserCoords}></SearchBar>
      <EventsBlock 
        location={currentLocation}
        currentEvents={currentEvents}
        handleEventOpen={handleEventOpen}
      ></EventsBlock>
      <AddEventForm
      openEventModal={openEventModal}
      handleEventClose={handleEventClose}
      >

      </AddEventForm>
      <AuthModal
        handleClose={handleClose}
        openAuthModal={openAuthModal}
        setsnackbarState={setsnackbarState}
      >

      </AuthModal>
      
        <div className="signup-button">
          <Box>
            <Button 
              variant="contained"
              size="small"
              color="info"
              type="out"
              onClick={() => {
                handleOpen(true);
              }}
            >
              Login 
            </Button>          
          </Box>
        </div>
    </div>
  );
}

export default App;
