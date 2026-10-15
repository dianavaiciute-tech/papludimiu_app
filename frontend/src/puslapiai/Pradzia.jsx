import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

      if (!atsakymas.ok) {
        throw new Error("Nepavyko ištrinti paplūdimio.");
      }

      setPapludimiai((dabartiniai) =>
        dabartiniai.filter((papludimys) => papludimys._id !== id),
      );
    } catch (error) {
      setKlaida(error.message);
    }
  }

  if (kraunama) {
    return <p>Kraunami paplūdimiai...</p>;
  }

  if (klaida) {
    return <p>{klaida}</p>;
  }

  return (
    <div>
      <h2>Lietuvos pajūrio paplūdimiai</h2>

      {papludimiai.length === 0 ? (
        <p>Paplūdimių kol kas nėra.</p>
      ) : (
        <ul>
          {papludimiai.map((papludimys) => (
            <li key={papludimys._id}>
              <strong>{papludimys.pavadinimas}</strong>
              {" — "}
              {papludimys.miestas}
              <br />
              Platuma: {papludimys.platuma}, ilguma: {papludimys.ilguma}
              <br />
              <button
                onClick={() =>
                  navigate(`/papludimiai/redaguoti/${papludimys._id}`)
                }
              >
                Redaguoti
              </button>
              <button onClick={() => istrintiPapludimi(papludimys._id)}>
                Ištrinti
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Pradzia;
