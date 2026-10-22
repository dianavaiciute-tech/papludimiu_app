import { useEffect, useState } from "react";

function Stebejimai() {
  const [stebejimai, setStebejimai] = useState([]);
  const [klaida, setKlaida] = useState("");
  const [zinute, setZinute] = useState("");

  async function gautiStebejimus() {
    try {
      const atsakymas = await fetch("http://localhost:5000/api/stebejimai");

      if (!atsakymas.ok) {
        throw new Error("Nepavyko gauti stebėjimų.");
      }

      const duomenys = await atsakymas.json();
      setStebejimai(duomenys);
      setKlaida("");
    } catch (error) {
      setKlaida("Nepavyko įkelti vandens stebėjimų.");
    }
  }

  useEffect(() => {
    gautiStebejimus();
  }, []);

  async function istrintiStebejima(id) {
    const patvirtinimas = window.confirm(
      "Ar tikrai nori ištrinti šį stebėjimą?",
    );

    if (!patvirtinimas) {
      return;
    }

    setKlaida("");
    setZinute("");

    try {
      const atsakymas = await fetch(
        `http://localhost:5000/api/stebejimai/${id}`,
        {
          method: "DELETE",
        },
      );

      const duomenys = await atsakymas.json();

      if (!atsakymas.ok) {
        throw new Error(duomenys.message || "Nepavyko ištrinti stebėjimo.");
      }

      setZinute("Stebėjimas ištrintas.");
      await gautiStebejimus();
    } catch (error) {
      setKlaida(error.message || "Įvyko klaida ištrinant stebėjimą.");
    }
  }

  return (
    <div>
      <h2>Vandens stebėjimai</h2>

      {klaida && <p>{klaida}</p>}
      {zinute && <p>{zinute}</p>}

      {!klaida && stebejimai.length === 0 && <p>Stebėjimų kol kas nėra.</p>}

      {stebejimai.map((stebejimas) => (
        <div key={stebejimas._id}>
          <p>
            Paplūdimys:{" "}
            {typeof stebejimas.papludimys === "object" &&
            stebejimas.papludimys !== null
              ? `${stebejimas.papludimys.pavadinimas} (${stebejimas.papludimys.miestas})`
              : "Paplūdimys nerastas"}
          </p>

          <p>Data: {new Date(stebejimas.data).toLocaleString("lt-LT")}</p>
          <p>Vandens temperatūra: {stebejimas.vandensTemperatura} °C</p>
          <p>Vandens kokybė: {stebejimas.vandensKokybe}</p>
          <p>Bangavimas: {stebejimas.bangavimas}</p>

          {stebejimas.pastabos && <p>Pastabos: {stebejimas.pastabos}</p>}

          <button
            onClick={() =>
              (window.location.href = `/stebejimai/redaguoti/${stebejimas._id}`)
            }
          >
            Redaguoti
          </button>

          <button onClick={() => istrintiStebejima(stebejimas._id)}>
            Ištrinti
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Stebejimai;
