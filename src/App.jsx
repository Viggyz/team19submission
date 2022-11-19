import { useEffect, useState, useRef } from "react";
import "./App.css";
import { Paper, InputBase, TextField } from "@mui/material";
import axios from "axios";

import MapComponent from "./components/mapComponent";

function App() {
  const [userCoords, setUserCoords] = useState();
  let debounceTimer = null;

  function handleMarkerClick(location) {
    console.log(location);
  }

  function callNomatim(inputText) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (inputText.length > 3) {
        axios
          .get(
            `http://localhost:8000/api/search?q=${inputText}`
          )
          .then(({ data }) => {
            let coords = {
              latitude: data[0].lat,
              longitude: data[0].lon,
            };
            setUserCoords(coords);
          });
      }
    }, 500);
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
      <TextField
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
        />
    </div>
  );
}

export default App;
