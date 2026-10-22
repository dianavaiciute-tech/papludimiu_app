import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NaujasPapludimys() {
  const [pavadinimas, setPavadinimas] = useState("");
  const [miestas, setMiestas] = useState("");
  const [platuma, setPlatuma] = useState("");
  const [ilguma, setIlguma] = useState("");
  const [zinute, setZinute] = useState("");

  const navigate = useNavigate();

  async function pridetiPapludimi(e) {
    e.preventDefault();
    setZinute("");

    if (
      !pavadinimas.trim() ||
      !miestas.trim() ||
      platuma === "" ||
      ilguma === ""
    ) {
      setZinute("Užpildykite visus privalomus laukus.");
      return;
    }

    if (
      !Number.isFinite(Number(platuma)) ||
      Number(platuma) < -90 ||
      Number(platuma) > 90
    ) {
      setZinute("Platuma turi būti skaičius nuo -90 iki 90.");
      return;
    }

    if (
      !Number.isFinite(Number(ilguma)) ||
      Number(ilguma) < -180 ||
      Number(ilguma) > 180
    ) {
      setZinute("Ilguma turi būti skaičius nuo -180 iki 180.");
      return;
    }

    setZinute("");

    try {
      const atsakymas = await fetch("http://localhost:5000/api/papludimiai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pavadinimas,
          miestas,
          platuma: Number(platuma),
          ilguma: Number(ilguma),
        }),
      });

      const duomenys = await atsakymas.json();

      if (!atsakymas.ok) {
        throw new Error(duomenys.message || "Nepavyko pridėti paplūdimio.");
      }

      navigate("/");
    } catch (error) {
      setZinute(error.message);
    }
  }

  return (
    <div>
      <h2>Naujas paplūdimys</h2>

      <form onSubmit={pridetiPapludimi}>
        <div>
          <label htmlFor="pavadinimas">Paplūdimio pavadinimas:</label>
          <input
            id="pavadinimas"
            value={pavadinimas}
            onChange={(e) => setPavadinimas(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="miestas">Miestas:</label>
          <input
            id="miestas"
            value={miestas}
            onChange={(e) => setMiestas(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="platuma">Platuma:</label>
          <input
            id="platuma"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={platuma}
            onChange={(e) => setPlatuma(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="ilguma">Ilguma:</label>
          <input
            id="ilguma"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={ilguma}
            onChange={(e) => setIlguma(e.target.value)}
            required
          />
        </div>

        <button type="submit">Pridėti paplūdimį</button>
      </form>

      {zinute && <p>{zinute}</p>}
    </div>
  );
}

export default NaujasPapludimys;
