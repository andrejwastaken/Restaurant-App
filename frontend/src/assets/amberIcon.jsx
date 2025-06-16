import L from "leaflet";
import "leaflet/dist/leaflet.css";

const amberIcon = new L.DivIcon({
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D97706" width="36px" height="36px">
      <path d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    </svg>`,
    className: "bg-transparent border-0", // Remove default divIcon styles
    iconSize: [36, 36],
    iconAnchor: [18, 36], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
});

export default amberIcon;