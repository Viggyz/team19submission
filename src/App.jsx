import { useEffect, useState } from "react";
import "./App.css";
import maplibregl, { Marker } from "maplibre-gl";
import { getLocations } from "./services/locations";
function App() {
  const [locations, setLocations] = useState([]);
  const [currentMap, setCurrentMap] = useState();
  const [userCoords, setUserCoords] = useState();
  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition((obj)=>{setUserCoords(obj.coords);
    console.log(obj.coords)},console.log);
    
  }, []);
  useEffect(()=>{
    console.log(userCoords);
    if(userCoords){
      const map =  new maplibregl.Map({
        container: "map",
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
    <div
      className="map"
      id="map"
      style={{ height: "100vh", width: "100vw" }}
    ></div>
  );
}

export default App;
