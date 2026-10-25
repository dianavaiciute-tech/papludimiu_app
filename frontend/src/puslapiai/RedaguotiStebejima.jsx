import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RedaguotiStebejima() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [papludimiai, setPapludimiai] = useState([]);
  const [papludimys, setPapludimys] = useState("");
  const [data, setData] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [kokybe, setKokybe] = useState("Gera");
  const [bangavimas, setBangavimas] = useState("Zalia");
  const [pastabos, setPastabos] = useState("");
  const [zinute, setZinute] = useState("");
  const [klaida, setKlaida] = useState("");

  useEffect(() => {
    async function gautiDuomenis() {
      try {
        const [papludimiuAtsakymas, stebejimuAtsakymas] = await Promise.all([
          fetch("http://localhost:5000/api/papludimiai"),
          fetch("http://localhost:5000/api/stebejimai"),
        ]);

        if (!papludimiuAtsakymas.ok || !stebejimuAtsakymas.ok) {
          throw new Error("Nepavyko gauti duomenų.");
        }

        const papludimiuDuomenys = await papludimiuAtsakymas.json();
        const stebejimuDuomenys = await stebejimuAtsakymas.json();

        const rastasStebejimas = stebejimuDuomenys.find(
          (irasas) => irasas._id === id,
        );

        if (!rastasStebejimas) {
          setKlaida("Stebėjimas nerastas.");
          return;
        }

        setPapludimiai(papludimiuDuomenys);
        setPapludimys(rastasStebejimas.papludimys);
        const vietineData = new Date(rastasStebejimas.data);
        vietineData.setMinutes(
          vietineData.getMinutes() - vietineData.getTimezoneOffset(),
        );
        setData(vietineData.toISOString().slice(0, 16));
        setTemperatura(String(rastasStebejimas.vandensTemperatura));
        setKokybe(rastasStebejimas.vandensKokybe);
        setBangavimas(rastasStebejimas.bangavimas);
        setPastabos(rastasStebejimas.pastabos || "");
      } catch {
        setKlaida("Nepavyko įkelti stebėjimo duomenų.");
      }
    }

    gautiDuomenis();
  }, [id]);

  async function issaugotiPakeitimus(event) {
    event.preventDefault();
    setKlaida("");
    setZinute("");

    if (!papludimys || !data || temperatura === "") {
      setKlaida("Užpildykite visus privalomus laukus.");
      return;
    }

    if (
      !Number.isFinite(Number(temperatura)) ||
      Number(temperatura) < -5 ||
      Number(temperatura) > 45
    ) {
      setKlaida("Temperatūra turi būti nuo -5 iki 45 °C.");
      return;
    }

    try {
      const atsakymas = await fetch(
        `http://localhost:5000/api/stebejimai/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            papludimys,
            data,
            vandensTemperatura: Number(temperatura),
            vandensKokybe: kokybe,
            bangavimas,
            pastabos,
          }),
        },
      );

      const duomenys = await atsakymas.json();

      if (!atsakymas.ok) {
        throw new Error(duomenys.message || "Nepavyko atnaujinti stebėjimo.");
      }

      setZinute("Pakeitimai išsaugoti!");
      setTimeout(() => navigate("/stebejimai"), 1000);
    } catch (error) {
      setKlaida(error.message || "Įvyko klaida.");
    }
  }

  if (klaida) {
    return (
      <div>
        <h2>Stebėjimo redagavimas</h2>
        <p>{klaida}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Stebėjimo redagavimas</h2>

      <form onSubmit={issaugotiPakeitimus}>
        <label>
          Paplūdimys:
          <select
            value={papludimys}
            onChange={(event) => setPapludimys(event.target.value)}
            required
          >
            {papludimiai.map((irasas) => (
              <option key={irasas._id} value={irasas._id}>
                {irasas.pavadinimas} – {irasas.miestas}
              </option>
            ))}
          </select>
        </label>

        <br />

        <label>
          Data ir laikas:
          <input
            type="datetime-local"
            value={data}
            onChange={(event) => setData(event.target.value)}
            required
          />
        </label>

        <br />

        <label>
          Vandens temperatūra (°C):
          <input
            type="number"
            step="0.1"
            min="0"
            max="45"
            value={temperatura}
            onChange={(event) => setTemperatura(event.target.value)}
            required
          />
        </label>

        {temperatura !== "" &&
          (Number(temperatura) < 0 || Number(temperatura) > 45) && (
            <p>Temperatūra turi būti nuo 0 °C iki 45 °C.</p>
          )}

        <br />

        <label>
          Vandens kokybė:
          <select
            value={kokybe}
            onChange={(event) => setKokybe(event.target.value)}
          >
            <option value="Puiki">Puiki</option>
            <option value="Gera">Gera</option>
            <option value="Bloga">Bloga</option>
          </select>
        </label>

        <br />

        <label>
          Bangavimas ir vėliava:
          <select
            value={bangavimas}
            onChange={(event) => setBangavimas(event.target.value)}
          >
            <option value="Zalia">Žalia – saugu maudytis</option>
            <option value="Geltona">Geltona – atsargiai</option>
            <option value="Raudona">Raudona – maudytis draudžiama</option>
          </select>
        </label>

        <br />

        <label>
          Pastabos:
          <textarea
            value={pastabos}
            onChange={(event) => setPastabos(event.target.value)}
          />
        </label>

        <br />

        <button type="submit">Išsaugoti pakeitimus</button>
      </form>

      {zinute && <p>{zinute}</p>}
    </div>
  );
}

export default RedaguotiStebejima;
