import { useEffect, useState, useRef } from "react";
import "./App.css";
import maplibregl, { Marker } from "maplibre-gl";
import { Paper, InputBase, TextField } from "@mui/material";
import { getLocations } from "./services/locations";
import axios from "axios";
function App() {
  const mapContainer = useRef(null)
  const [locations, setLocations] = useState([]);
  const [currentMap, setCurrentMap] = useState();
  const [userCoords, setUserCoords] = useState();
  let debounceTimer = null;

  function callNomatim(inputText) {
    if (debounceTimer)
      clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => {
      if (inputText.length > 3) {
        axios.get(`https://nominatim.openstreetmap.org/?city=${inputText}&format=json&limit=1`)
        .then(({data} )=> {
          let coords = {
            latitude: data[0].lat,
            longitude: data[0].lon
          };
          setUserCoords(coords) 
        })
      }
    }, 500)
  }


  useEffect(() => {
    // axios.get('https://api.techniknews.net/ipgeo')
    // .then(data => console.log(data))
  window.navigator.geolocation.getCurrentPosition((obj)=>{
    console.log(obj)
    setUserCoords(obj.coords) 
  }, null);
  }, []);
  useEffect(()=>{
    console.log(userCoords, "changed")
    if(userCoords){
      const map =  new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL", // stylesheet location
        center: [userCoords.longitude, userCoords.latitude], // starting position [lng, lat]
        zoom: 10, // starting zoom
      });
      setCurrentMap(map);
  
      getLocations(userCoords.longitude, userCoords.latitude).then((response)=>{
        setLocations(response.data);
      })
    }
    
  }, [userCoords]);
  useEffect(()=>{
    locations.map((location)=>{
      // console.log([location.point.lon,location.point.lat]);
      return new Marker().setLngLat([location.point.lon,location.point.lat]).addTo(currentMap);
    });
  },[locations])
  return (
    <div className="map-wrap">
    <div
    className="map"
      ref={mapContainer}
    >
      <TextField id="filled-basic" placeholder="Enter a location"
        style={{zIndex: 100, display: 'absolute', top: '5px', left: '5px', backgroundColor: 'white'}}
        onChange={(evt) => callNomatim(evt.target.value)}
        />
    </div>

    </div>
  );
}

export default App;
