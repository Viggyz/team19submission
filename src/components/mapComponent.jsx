import { renderToStaticMarkup } from "react-dom/server";
import {useRef, useState, useEffect} from "react"
import { Locations } from "../api.service";
import maplibregl, { Marker } from "maplibre-gl";



function MapComponent({userCoords, handleMarkerClick}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [locations, setLocations] = useState([]);

    function addMarkers(locationData) {
        locations.forEach((location => location.remove()))
        setLocations(
            locationData.map((location) => {
                const element = document.createElement("div");
                element.id = "marker";
                // const jsele
                const jsele = (
                    <div className="marker_container">
                        <div className="marker-text">9/10</div>
                        <div className="marker-icon"></div>
                    </div>
                );
                element.onclick = () => {
                    handleMarkerClick(location); 
                };
                element.innerHTML = renderToStaticMarkup(jsele);
                return new Marker(element)
                .setLngLat([location.lon, location.lat])
                .addTo(map.current);
            })
        )
    }

    useEffect(() => {
        if (map.current) return;
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style:
              "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL", // stylesheet location
            center: ['77.5946', '12.9716'], // starting position [lng, lat]
            zoom: 10, // starting zoom
          });
    }, [])
    useEffect(() => {
        if (userCoords) {
            map.current.flyTo({
                center: [userCoords.longitude, userCoords.latitude],
                zoom: 14,
            })
            Locations.list(userCoords.longitude, userCoords.latitude).then(
                (response) => {
                addMarkers(response.data);
            });
        }
    },[userCoords])
    
    return (
        <div className="map"  ref={mapContainer}>
        </div>
    )
}

export default MapComponent;

