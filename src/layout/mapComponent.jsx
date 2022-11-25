import { renderToStaticMarkup } from "react-dom/server";
import { useRef, useState, useEffect } from "react";

import { Map, Marker } from "maplibre-gl";

import { Locations } from "../api.service";

function MapComponent({ userCoords, handleMarkerClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [locations, setLocations] = useState([]);

  function addMarkers(locationData) {
    locations.forEach((location) => location.remove());
    setLocations(
      locationData.map((location) => {
        const element = document.createElement("div");
        element.id = "marker";
        const jsele = (
          <div className="marker_container">
            <div className="marker-icon"></div>
          </div>
        );
        element.onclick = () => {
          handleMarkerClick(location);
          if (map.current) {
            map.current.flyTo({
              center: [location.lon, location.lat],
              zoom: 16,
            });
          }
        };
        element.innerHTML = renderToStaticMarkup(jsele);
        return new Marker(element)
          .setLngLat([location.lon, location.lat])
          .addTo(map.current);
      })
    );
  }

  useEffect(() => {
    if (map.current) return;
    map.current = new Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets",
      center: ["77.5946", "12.9716"],
      zoom: 10,
    });
  }, []);
  useEffect(() => {
    if (userCoords) {
      map.current.flyTo({
        center: [userCoords.longitude, userCoords.latitude],
        zoom: 17,
      });
      Locations.search(userCoords.longitude, userCoords.latitude).then(
        (response) => {
          addMarkers(response.data);
        }
      );
    }
  }, [userCoords]);

  return <div className="map" ref={mapContainer}></div>;
}

export default MapComponent;
