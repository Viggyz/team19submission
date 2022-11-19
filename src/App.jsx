import { useEffect, useState } from "react";
import "./App.css";

import { Button, TextField, Typography, Modal, Box } from "@mui/material";

import axios from "axios";

import { encode_location_id } from "./utils";

import MapComponent from "./components/mapComponent";
import SearchBar  from "./components/searchBar";
import EventsBlock from "./components/eventBlock";
import AuthModal from "./components/authModal";

function App() {
  const [userCoords, setUserCoords] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentEvents, setCurrentEvents] = useState(null);

  function callEventsAPI(location) {
    if(location) {
      let osm_type_id = encode_location_id(location);
      axios.get(`http://localhost:8000/api/locations/${osm_type_id}/events`)
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

  const [signUpEmail, setSignUpEmail] = useState();
  const [signUpPassword, setSignUpPassword] = useState();
  const [signUpUsername, setSignUpUsername] = useState();
  const [loginPassword, setLoginPassword] = useState();
  const [loginUsername, setLoginUsername] = useState();
  const [isSignup, setIsSignUp] = useState(false);
  
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const handleOpen = () => setOpenAuthModal(true);
  const handleClose = () => setOpenAuthModal(false);
  
  const [isLogin, setIsLogin] = useState(false);
  
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
      <MapComponent
        userCoords={userCoords}
        setIsSignUp={setIsSignUp}
        setIsLogin={setIsLogin}
        handleMarkerClick={handleMarkerClick}
      ></MapComponent>
      <SearchBar setUserCoords={setUserCoords}></SearchBar>
      <EventsBlock 
        location={currentLocation}
        currentEvents={currentEvents}
      ></EventsBlock>
      <AuthModal
        handleClose={handleClose}
        openAuthModal={openAuthModal}
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
