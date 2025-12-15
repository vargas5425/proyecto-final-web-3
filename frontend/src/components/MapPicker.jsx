import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function LocationMarker({ position, setPosition, setLugar, readOnly }) {
  useMapEvents({
    click: async (evento) => {
      if (readOnly) 
        return;

      const pos = [evento.latlng.lat, evento.latlng.lng];
      setPosition(pos);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos[0]}&lon=${pos[1]}`
        );
        const data = await res.json();
        setLugar(data.display_name || "");
      } catch (err) {
        console.error("Error obteniendo nombre del lugar:", err);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

  export default function MapPicker({
  lat,
  lng,
  setLat,
  setLng,
  setLugar,
  height = 300,
  readOnly = false //si es true, no permite mover el marcador
}) 

{
  const position = lat && lng ? [Number(lat), Number(lng)] : null;
  const center = position || [-17.783709843935334, -63.182755429697316];

  //actualiza la posicion en el padre(crearEvento)
  const handleSetPosition = (pos) => {
    if (!pos || readOnly) return;
    setLat(pos[0]);
    setLng(pos[1]);
  };

  return (
    <div className="w-100" style={{ height }}>
      <MapContainer center={center} zoom={13} className="w-100 h-100">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* marcador de la ubicacion */}
        <LocationMarker
          position={position}
          setPosition={handleSetPosition}
          setLugar={setLugar}
          readOnly={readOnly}
        />
      </MapContainer>
    </div>
  );
}

