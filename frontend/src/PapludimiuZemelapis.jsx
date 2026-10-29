import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function PapludimiuZemelapis({
  papludimiai,
  setPasirinktasPapludimys,
  setRodytiGrafika,
}) {
  return (
    <div className="zemelapio-pagrindas">
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
            eventHandlers={{
              click: () => setPasirinktasPapludimys(papludimys),
            }}
          >
            <Popup>
              <strong>{papludimys.pavadinimas}</strong>
              <br />
              {papludimys.miestas}
              <br />

              <a
                href="#temperaturos-grafikas"
                onClick={(event) => {
                  event.preventDefault();
                  setPasirinktasPapludimys(papludimys);
                  setRodytiGrafika(true);
                }}
                style={{
                  color: "#168aad",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Rodyti grafiką
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default PapludimiuZemelapis;
