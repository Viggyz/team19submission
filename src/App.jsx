import { useEffect, useState } from "react";
import "./App.css";

import axios from "axios";
import {Button, TextField, Box} from "@mui/material"

import { encode_location_id } from "./utils";

import MapComponent from "./components/mapComponent";
import SearchBar  from "./components/searchBar";
import EventsBlock from "./components/eventBlock";

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
  const [open, setOpen] = useState(false);
  const [isSignup, setIsSignUp] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLogin, setIsLogin] = useState(false);
  const handleSignUp = ()=>{
    console.log(signUpEmail, signUpPassword);
  }
  const handleLogin = ()=>{
    console.log(loginUsername, loginPassword);
    
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

  useEffect(() => {
    setUserCoords({longitude: '77.5946',latitude: '12.9716'});
  }, []);
 return (
    <div className="map-wrap">
      <MapComponent userCoords={userCoords} setIsSignUp={setIsSignUp} setIsLogin={setIsLogin} handleMarkerClick={handleMarkerClick}></MapComponent>
      <SearchBar 
        setUserCoords={setUserCoords}
      ></SearchBar>
      <EventsBlock 
        location={currentLocation}
        currentEvents={currentEvents}
      ></EventsBlock>
        
        {isSignup===true?(<div className="signup-box">
          <div className = "sigup-label">SIGN UP</div>
          <div className = "sigup-email">Email</div>
          <TextField onChange={(evt)=>setSignUpEmail(evt.target.value)}/>
          <div> </div>
          <div className = "sigup-username">Username</div>
          <TextField onChange={(evt)=>setSignUpUsername(evt.target.value)}/>
          <div> </div>
          <div className = "sigup-password">Password</div>
          <TextField onChange={(evt)=>setSignUpPassword(evt.target.value)}/>
          <div></div>
          <Button onClick={handleSignUp}>SIGN UP</Button> 
          <div>Already Signed In?</div> 
          <Button onClick={()=>{setIsSignUp(false); setIsLogin(true)}}>Login</Button>          
        </div>):null}
        {isLogin===true?(<div className="signup-box">
          <div className = "sigup-label">LOGIN</div>
          <div className = "sigup-email">Username</div>
          <TextField onChange={(evt)=>setSignUpEmail(evt.target.value)}/>
          <div> </div>
          <div className = "sigup-username">Password</div>
          <TextField onChange={(evt)=>setSignUpUsername(evt.target.value)}/>
          <div> </div>
          <Button onClick={handleSignUp}>Login</Button>
          <div>Don't have an account?</div> 
          <Button onClick={()=>{setIsSignUp(true); setIsLogin(false)}}>Sign Up</Button>          
        </div>):null}
        <div className="signup-button">
          <Box>
            <Button 
              variant="contained"
              size="small"
              color="info"
              type="out"
              onClick={()=>setIsSignUp(true)}
            >
              SIGN UP
            </Button>          
          </Box>
        </div>
        
        
      </div>
  );
}

export default App;
