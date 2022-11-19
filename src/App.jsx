import { useEffect, useState, useRef } from "react";
import "./App.css";

import MapComponent from "./components/mapComponent";
import SearchBar  from "./components/searchBar";
import {Button, TextField, Typography, Modal, Box} from "@mui/material"
import axios from "axios";

function App() {
  const [userCoords, setUserCoords] = useState();
  function handleMarkerClick(location) {
    console.log(location);
  }
  const [signUpEmail, setSignUpEmail] = useState();
  const [signUpPassword, setSignUpPassword] = useState();
  const [signUpUsername, setSignUpUsername] = useState();
  const [loginPassword, setLoginPassword] = useState();
  const [loginUsername, setLoginUsername] = useState();
  const [open, setOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
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
  let debounceTimer = null;
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
  function callNomatim(inputText) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (inputText.length > 3) {
        axios
          .get(
            `http://localhost:8000/api/search?q=${inputText}`
          )
          .then(({ data} ) => {
            console.log("data",data);
            let coords = {
              latitude: data[0].lat,
              longitude: data[0].lon,
            };
            setUserCoords(coords);
          });
      }
    }, 500);

  }
  
  // const signup = ()=>{
  //   axios.get()
  // }

  useEffect(() => {
    // axios.get('https://api.techniknews.net/ipgeo')
    // .then(data => console.log(data))
    // window.navigator.geolocation.getCurrentPosition((obj) => {
    //   console.log(obj);
    //   setUserCoords(obj.coords);
    // }, null);
    setUserCoords({longitude: '77.5946',latitude: '12.9716'})
  }, []);
 return (
    <div className="map-wrap">
      <MapComponent userCoords={userCoords} setIsSignUp={setIsSignUp} setIsLogin={setIsLogin} handleMarkerClick={handleMarkerClick}></MapComponent>
      <SearchBar 
        setUserCoords={setUserCoords}
      ></SearchBar>
        
        {currentLocation?(<div className="side-box">
          <div className="site-name">{currentLocation.display_name || ""}</div>
          <div className="event-list">
            <div>event 1</div>
            <div>event 2</div>
          </div>     
        </div>):null}
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
        <Button type="out" onClick={()=>setIsSignUp(true)}>SIGN UP</Button>          
          
        </div>
        
        
      </div>
  );
}

export default App;
