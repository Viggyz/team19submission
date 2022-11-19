import { useEffect, useState, useRef } from "react";
import "./App.css";
import { Paper, InputBase, TextField } from "@mui/material";
import axios from "axios";

import MapComponent from "./components/mapComponent";
import SearchBar  from "./components/searchBar";

function App() {
  const [userCoords, setUserCoords] = useState();

  function handleMarkerClick(location) {
    console.log(location);
  }

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
      <MapComponent userCoords={userCoords} handleMarkerClick={handleMarkerClick}></MapComponent>
      <SearchBar 
        setUserCoords={setUserCoords}
      ></SearchBar>
      {/* <TextField
          id="filled-basic"
          placeholder="Enter a location"
          style={{
            zIndex: 100,
            display: "absolute",
            top: "5px",
            left: "5px",
            backgroundColor: "white",
          }}
          onChange={(evt) => callNomatim(evt.target.value)}
        /> */}
    </div>
  );
}

export default App;
