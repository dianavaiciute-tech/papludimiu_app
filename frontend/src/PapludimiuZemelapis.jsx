import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function PapludimiuZemelapis({ papludimiai }) {
  return (
    <div className="zemelapio-apvalkalas">
      <MapContainer
        center={[55.5, 21.2]}
        zoom={8}
        scrollWheelZoom={true}
        className="papludimiu-zemelapis"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {papludimiai.map((papludimys) => (
          <Marker
            key={papludimys._id}
            position={[Number(papludimys.platuma), Number(papludimys.ilguma)]}
          >
            <Popup>
              <strong>{papludimys.pavadinimas}</strong>
              <br />
              {papludimys.miestas}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default PapludimiuZemelapis;
