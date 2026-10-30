import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PapludimiuZemelapis from "../PapludimiuZemelapis";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import beachIcon from "../assets/beach_icon_new.png";
import mapMarker from "../assets/map_marker_new.png";

function Pradzia() {
  const [papludimiai, setPapludimiai] = useState([]);
  const [stebejimai, setStebejimai] = useState([]);
  const [pasirinktasPapludimys, setPasirinktasPapludimys] = useState(null);
  const grafikoRef = useRef(null);
  const [rodytiGrafika, setRodytiGrafika] = useState(false);
  const [kraunama, setKraunama] = useState(true);
  const [klaida, setKlaida] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/papludimiai")
      .then((atsakymas) => {
        if (!atsakymas.ok) {
          throw new Error("Nepavyko gauti paplūdimių.");
        }
        return atsakymas.json();
      })
      .then((duomenys) => {
        setPapludimiai(duomenys);
      })
      .catch((error) => {
        setKlaida(error.message);
      })
      .finally(() => {
        setKraunama(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/stebejimai")
      .then((atsakymas) => {
        if (!atsakymas.ok) {
          throw new Error("Nepavyko gauti vandens stebėjimų.");
        }

        return atsakymas.json();
      })
      .then((duomenys) => {
        setStebejimai(duomenys);
      })
      .catch((error) => {
        console.error("Stebėjimų užkrovimo klaida:", error);
      });
  }, []);

  const grafikoDuomenys = stebejimai
    .filter((stebejimas) => {
      return (
        pasirinktasPapludimys &&
        stebejimas.papludimys?._id === pasirinktasPapludimys._id
      );
    })
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .map((stebejimas) => ({
      data: new Date(stebejimas.data).toLocaleDateString("lt-LT"),
      temperatura: Number(stebejimas.vandensTemperatura),
    }));

  useEffect(() => {
    if (rodytiGrafika && pasirinktasPapludimys && grafikoRef.current) {
      grafikoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setRodytiGrafika(false);
    }
  }, [rodytiGrafika, pasirinktasPapludimys]);

  async function istrintiPapludimi(id) {
    const patvirtinta = window.confirm(
      "Ar tikrai norite ištrinti šį paplūdimį?",
    );

    if (!patvirtinta) {
      return;
    }

    try {
      const atsakymas = await fetch(
        `http://localhost:5000/api/papludimiai/${id}`,
        {
          method: "DELETE",
        },
      );

      const duomenys = await atsakymas.json();

      if (!atsakymas.ok) {
        alert(duomenys.message || "Nepavyko ištrinti paplūdimio.");
        return;
      }

      setPapludimiai((dabartiniai) =>
        dabartiniai.filter((papludimys) => papludimys._id !== id),
      );
    } catch (error) {
      alert("Nepavyko susisiekti su serveriu.");
      console.error("Paplūdimio trynimo klaida:", error);
    }
  }

  if (kraunama) {
    return <p>Kraunami paplūdimiai...</p>;
  }

  if (klaida) {
    return <p>{klaida}</p>;
  }

  return (
    <div className="pradzios-puslapis">
      <div className="puslapio-antraste">
        <div>
          {/* <p className="virs-zyma">LIETUVOS BALTIJOS PAKRANTĖ</p> */}
          <h1>Lietuvos paplūdimiai</h1>
          <p className="antrastes-aprasymas">
            Pažink Lietuvos paplūdimius ir stebėk vandens būklę.
          </p>
        </div>

        <button onClick={() => navigate("/papludimiai/naujas")}>
          + Pridėti paplūdimį
        </button>
      </div>

      <div className="papludimiu-skaicius">
        Iš viso paplūdimių: <strong>{papludimiai.length}</strong>
      </div>

      <section className="zemelapio-sekcija">
        <h2>Paplūdimiai žemėlapyje</h2>
        <p>Pasirink žymeklį ir peržiūrėk informaciją apie paplūdimį.</p>

        <PapludimiuZemelapis
          papludimiai={papludimiai}
          pasirinktasPapludimys={pasirinktasPapludimys}
          setPasirinktasPapludimys={setPasirinktasPapludimys}
          setRodytiGrafika={setRodytiGrafika}
        />
      </section>

      <section className="rodikliu-paaiskinimas">
        <h2>Kaip suprasti vandens rodiklius?</h2>
        <p>
          Čia pateikiami trumpi vandens kokybės ir bangavimo kategorijų
          paaiškinimai.
        </p>

        <div className="rodikliu-grupe">
          <h3>Vandens kokybė</h3>

          <div className="rodiklio-eilute">
            <span className="rodiklio-zyma kokybe-puiki">Puiki</span>
            <p>
              Vanduo yra skaidrus, nematyti vandenyje plaukiojančių dalelių,
              vandens spalva nėra pakitusi.
            </p>
          </div>

          <div className="rodiklio-eilute">
            <span className="rodiklio-zyma kokybe-gera">Gera</span>
            <p>
              Vanduo yra drumstesnis, vandenyje esančių dalelių kiekis yra
              nedidelis, vanduo žalsvos ar rusvos spalvos.
            </p>
          </div>

          <div className="rodiklio-eilute">
            <span className="rodiklio-zyma kokybe-bloga">Bloga</span>
            <p>
              Vanduo - neskaidrus, vandenyje esančių didelių kieks yra didelis,
              paviršiuje matyti plėvelė, vanduo itin žalios ar rusvos spalvos,
              jaučiamas nemalonus kvapas.
            </p>
          </div>
        </div>

        <div className="rodikliu-grupe">
          <h3>Bangavimas</h3>

          <div className="rodiklio-eilute">
            <span className="rodiklio-zyma bangavimas-zalias">Žalia</span>
            <p>Saugu maudytis - vandens paviršius ramus, bangų nėra.</p>
          </div>

          <div className="rodiklio-eilute">
            <span className="rodiklio-zyma bangavimas-geltonas">Geltona</span>
            <p>
              Atsarbiai - vandens paviršius banguoja, bangos iki 30 cm, nėra
              atgalinių srovių.
            </p>
          </div>

          <div className="rodiklio-eilute">
            <span className="rodiklio-zyma bangavimas-raudonas">Raudona</span>
            <p>
              Maudytis draudžiama - vandens paviršius ypač banguoja, bangos
              daugiau nei 30 cm, susiformavusios bangų gožos zonos, stiprios
              atgalinės srovės.
            </p>
          </div>
        </div>

        <p className="rodikliu-pastaba">
          Pateikta informacija ir įvertinimas nėra oficialus maudymosi saugumo
          įvertinimas. Vadovaukis oficialiais perspėjimais.
        </p>
      </section>

      {pasirinktasPapludimys && (
        <section
          id="temperaturos-grafikas"
          ref={grafikoRef}
          className="temperaturos-grafiko-sekcija"
        >
          <button type="button" onClick={() => setPasirinktasPapludimys(null)}>
            Uždaryti grafiką
          </button>
          <h2>Vandens temperatūros istorija</h2>
          <p>
            {pasirinktasPapludimys.pavadinimas} —{" "}
            {pasirinktasPapludimys.miestas}
          </p>

          {grafikoDuomenys.length === 0 ? (
            <p>Šiam paplūdimiui vandens temperatūros stebėjimų dar nėra.</p>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 15, right: 20, bottom: 20, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="category"
                    dataKey="data"
                    name="Data"
                    tick={{ fontSize: 12 }}
                    angle={-25}
                    textAnchor="end"
                    height={55}
                  />
                  <YAxis
                    type="number"
                    dataKey="temperatura"
                    name="Temperatūra"
                    unit=" °C"
                    domain={["auto", "auto"]}
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Vandens temperatūra"
                    data={grafikoDuomenys}
                    fill="#168aad"
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      )}

      {papludimiai.length === 0 ? (
        <div className="tuscias-pranesimas">
          <h3>Kol kas nėra paplūdimių</h3>
          <p>Pridėk pirmąjį paplūdimį, kad galėtum pradėti.</p>
        </div>
      ) : (
        <div className="papludimiu-sarasas">
          {papludimiai.map((papludimys) => (
            <article className="papludimio-kortele" key={papludimys._id}>
              <div className="korteles-zenklas">
                <img src={beachIcon} alt="Paplūdimys" />
              </div>

              <div className="papludimio-informacija">
                <h3>{papludimys.pavadinimas}</h3>
                <p className="papludimio-miestas">
                  <span className="miesto-zenklas">
                    <img src={mapMarker} alt="" />
                  </span>
                  {papludimys.miestas}
                </p>

                <div className="koordinates">
                  <span>Platuma: {papludimys.platuma}</span>
                  <span>Ilguma: {papludimys.ilguma}</span>
                </div>
              </div>

              <div className="papludimio-veiksmai">
                <button
                  className="redagavimo-mygtukas"
                  onClick={() =>
                    navigate(`/papludimiai/redaguoti/${papludimys._id}`)
                  }
                >
                  Redaguoti
                </button>

                <button
                  className="trynimo-mygtukas"
                  onClick={() => istrintiPapludimi(papludimys._id)}
                >
                  Ištrinti
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Pradzia;
