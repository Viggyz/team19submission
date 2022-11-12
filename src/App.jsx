import { useEffect, useState } from 'react'
import './App.css'
import maplibregl from 'maplibre-gl';
function App() {
  const [count, setCount] = useState(0)
  useEffect(()=>{
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', // stylesheet location
      center: [75, 20], // starting position [lng, lat]
      zoom: 9 // starting zoom
      });
    
  },[])
  return (
    <div className="map" id="map" style={{height: "100vh", width: "100vw"}}>

    </div>
  )
}

export default App
