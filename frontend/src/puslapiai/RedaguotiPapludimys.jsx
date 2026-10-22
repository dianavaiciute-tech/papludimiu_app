import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RedaguotiPapludimys() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pavadinimas, setPavadinimas] = useState("");
  const [miestas, setMiestas] = useState("");
  const [platuma, setPlatuma] = useState("");
  const [ilguma, setIlguma] = useState("");
  const [kraunama, setKraunama] = useState(true);
  const [klaida, setKlaida] = useState("");

  useEffect(() => {
    async function gautiPapludimi() {
      try {
        const atsakymas = await fetch("http://localhost:5000/api/papludimiai");

        if (!atsakymas.ok) {
          throw new Error("Nepavyko gauti paplūdimių.");
        }

        const papludimiai = await atsakymas.json();
        const rastas = papludimiai.find((p) => p._id === id);

        if (!rastas) {
          throw new Error("Paplūdimys nerastas.");
        }

        setPavadinimas(rastas.pavadinimas);
        setMiestas(rastas.miestas);
        setPlatuma(String(rastas.platuma));
        setIlguma(String(rastas.ilguma));
      } catch (error) {
        setKlaida(error.message);
      } finally {
        setKraunama(false);
      }
    }

    gautiPapludimi();
  }, [id]);

  async function issaugotiPakeitimus(e) {
    e.preventDefault();
    setKlaida("");

    if (
      !pavadinimas.trim() ||
      !miestas.trim() ||
      platuma === "" ||
      ilguma === ""
    ) {
      setKlaida("Užpildykite visus privalomus laukus.");
      return;
    }

    if (
      !Number.isFinite(Number(platuma)) ||
      Number(platuma) < -90 ||
      Number(platuma) > 90
    ) {
      setKlaida("Platuma turi būti skaičius nuo -90 iki 90.");
      return;
    }

    if (
      !Number.isFinite(Number(ilguma)) ||
      Number(ilguma) < -180 ||
      Number(ilguma) > 180
    ) {
      setKlaida("Ilguma turi būti skaičius nuo -180 iki 180.");
      return;
    }

    setKlaida("");

    try {
      const atsakymas = await fetch(
        `http://localhost:5000/api/papludimiai/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pavadinimas,
            miestas,
            platuma: Number(platuma),
            ilguma: Number(ilguma),
          }),
        },
      );

      const duomenys = await atsakymas.json();

      if (!atsakymas.ok) {
        throw new Error(duomenys.message || "Nepavyko išsaugoti pakeitimų.");
      }

      navigate("/");
    } catch (error) {
      setKlaida(error.message);
    }
  }

  if (kraunama) {
    return <p>Kraunami duomenys...</p>;
  }

  return (
    <div>
      <h2>Redaguoti paplūdimį</h2>

      {klaida && <p>{klaida}</p>}

      <form onSubmit={issaugotiPakeitimus}>
        <div>
          <label htmlFor="pavadinimas">Pavadinimas:</label>
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

        <button type="submit">Išsaugoti pakeitimus</button>
      </form>
    </div>
  );
}

export default RedaguotiPapludimys;
