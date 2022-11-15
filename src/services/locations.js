import axios from "axios" 


const getLocations = (lon, lat)=>{
  return  axios.get(`http://localhost:8000/api/locations?lon=${lon}&lat=${lat}`)
}

 export {getLocations}