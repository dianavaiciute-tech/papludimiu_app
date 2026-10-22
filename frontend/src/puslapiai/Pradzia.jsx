import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PapludimiuZemelapis from "../PapludimiuZemelapis";

function Pradzia() {
  const [papludimiai, setPapludimiai] = useState([]);
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
          <p className="virsrasa-zyma">LIETUVOS BALTIJOS PAKRANTĖ</p>
          <h1>Lietuvos pajūrio paplūdimiai</h1>
          <p className="antrastes-aprasymas">
            Peržiūrėk paplūdimius ir tvarkyk informaciją apie pakrantę.
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
        <p>Pasirink žymeklį ir peržiūrėk paplūdimio informaciją.</p>

        <PapludimiuZemelapis papludimiai={papludimiai} />
      </section>

      {papludimiai.length === 0 ? (
        <div className="tuscias-pranesimas">
          <h3>Kol kas nėra paplūdimių</h3>
          <p>Pridėk pirmąjį paplūdimį, kad galėtum pradėti.</p>
        </div>
      ) : (
        <div className="papludimiu-sarasas">
          {papludimiai.map((papludimys) => (
            <article className="papludimio-kortele" key={papludimys._id}>
              <div className="korteles-zenklas">🌊</div>

              <div className="papludimio-informacija">
                <h3>{papludimys.pavadinimas}</h3>
                <p className="papludimio-miestas">
                  <span>📍</span> {papludimys.miestas}
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
