import { useEffect, useState } from "react";
import "./App.css";

import { Button, Box, Paper, Snackbar, Alert, Typography } from "@mui/material";

import MapComponent from "./components/mapComponent";
import SearchBar  from "./components/searchBar";
import EventsBlock from "./components/eventBlock";

import AuthModal from "./components/authModal";
import AddEventForm from "./components/addEventForm"
import UserStatusBar from "./components/userStatusbar"; 

import { Locations, Events } from "./api.service";

function App() {
  const [userCoords, setUserCoords] = useState();
  const [userCity, setUserCity] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentEvents, setCurrentEvents] = useState(null);
  const [openEventModal, setOpenEventModal] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(localStorage.getItem("access")?true:false);
  const [snackbarState, setsnackbarState] = useState({
    open: false,
    message: "",
    severity: "success"
  })
  const [openAuthModal, setOpenAuthModal] = useState(false);
  
  const handleEventOpen = () => {
    if (isUserLoggedIn) {
      setOpenEventModal(true);
    }
    else {
      setOpenAuthModal(true);
    }
  };
  const handleEventClose = () => {
    handleMarkerClick(currentLocation);
    setOpenEventModal(false);
  };
  const handleAuthOpen = () => setOpenAuthModal(true);
  const handleAuthClose = () => setOpenAuthModal(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setsnackbarState({
      ...snackbarState,
      open:false
    });
  };


  function handleMarkerClick(location) {
    if(location) {
      setCurrentLocation(location);
      if(location) {
        Locations.events(location)
        .then(({data}) => {
          return setCurrentEvents(data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setCurrentEvents([])
          }
        })
      }
    }
  }
 
  function removeTokens() {
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    setIsUserLoggedIn(false);
  }
  
  function updateUserCity(city) {
    if (city===userCity) {
      Events.list(userCity)
      .then(({data: events}) => {
        setCurrentEvents(events);
        setCurrentLocation(null);
      })
      .catch(err => console.debug(err));
    }
    else {
      setUserCity(city);
    }
  }
  
  useEffect(() => {
    Events.list(userCity)
    .then(({data: events}) => {
      setCurrentEvents(events);
      setCurrentLocation(null);
    })
    .catch(err => console.debug(err));
  },[userCity])
  
  useEffect(() => {
    fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(({country_name, latitude, longitude, city}) => {
      if (country_name === 'India') {
        setUserCoords({ longitude, latitude});
        setUserCity(city);
      }
      else {
        setUserCoords({longitude: '77.5946',latitude: '12.9716'});
        setUserCity("Bengaluru");
        // setUserCoords({ longitude, latitude});
      }
    })
    .catch(err => console.debug(err))
    
    window.addEventListener('addTokens', () => {
      setIsUserLoggedIn(true);
    });
    window.addEventListener('removeTokens', () => {
      setIsUserLoggedIn(false);
    });
    return () => {
      window.removeEventListener('addTokens', () => setIsUserLoggedIn(true));
      window.removeEventListener('removeTokens', () => setIsUserLoggedIn(false));
    }
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
        handleMarkerClick={handleMarkerClick}
      ></MapComponent>
      <SearchBar 
        setUserCoords={setUserCoords}
        setUserCity={updateUserCity}
        setCurrentLocation={setCurrentLocation}
      ></SearchBar>
      <EventsBlock 
        location={currentLocation}
        currentEvents={currentEvents}
        handleEventOpen={handleEventOpen}
        setsnackbarState={setsnackbarState}
        setUserCoords={setUserCoords}
        setCurrentEvents={setCurrentEvents}
      />
      <AddEventForm
      openEventModal={openEventModal}
      handleEventClose={handleEventClose}
      currentLocation={currentLocation}
      setsnackbarState={setsnackbarState}
      userCity={userCity}
      >

      </AddEventForm>
      <AuthModal
        handleAuthClose={handleAuthClose}
        openAuthModal={openAuthModal}
        setsnackbarState={setsnackbarState}
      />
      
    <UserStatusBar
      
      isUserLoggedIn={isUserLoggedIn}
      removeTokens={removeTokens}
      handleAuthOpen={handleAuthOpen}
      setsnackbarState={setsnackbarState}
    />
      
    </div>
  );
}

export default App;
