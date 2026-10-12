import { useEffect, useState } from "react";

function App() {
  const [papludimiai, setPapludimiai] = useState([]);
  const [klaida, setKlaida] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/papludimiai")
      .then((atsakymas) => {
        if (!atsakymas.ok) {
          throw new Error("Nepavyko gauti paplūdimių");
        }

        return atsakymas.json();
      })
      .then((duomenys) => {
        setPapludimiai(duomenys);
      })
      .catch(() => {
        setKlaida("Nepavyko įkelti paplūdimių.");
      });
  }, []);

  return (
    <div>
      <h1>Paplūdimių vandens stebėjimas</h1>

      <h2>Paplūdimiai</h2>

      {klaida && <p>{klaida}</p>}

      {papludimiai.length === 0 && !klaida && <p>Paplūdimių kol kas nėra.</p>}

      {papludimiai.map((papludimys) => (
        <div key={papludimys._id}>
          <h3>{papludimys.pavadinimas}</h3>
          <p>Miestas: {papludimys.miestas}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
