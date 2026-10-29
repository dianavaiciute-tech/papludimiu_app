import { useEffect, useState } from "react";

function NaujasStebejimas() {
  const [papludimiai, setPapludimiai] = useState([]);
  const [papludimys, setPapludimys] = useState("");
  const [data, setData] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [kokybe, setKokybe] = useState("Gera");
  const [bangavimas, setBangavimas] = useState("Žalia");
  const [pastabos, setPastabos] = useState("");
  const [zinute, setZinute] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/papludimiai")
      .then((atsakymas) => atsakymas.json())
      .then((duomenys) => {
        setPapludimiai(duomenys);

        if (duomenys.length > 0) {
          setPapludimys(duomenys[0]._id);
        }
      })
      .catch(() => {
        setZinute("Nepavyko įkelti paplūdimių.");
      });
  }, []);

  async function pateiktiForma(event) {
    event.preventDefault();
    setZinute("");

    if (!papludimys || !data || temperatura === "") {
      setZinute("Užpildykite visus privalomus laukus.");
      return;
    }

    if (
      !Number.isFinite(Number(temperatura)) ||
      Number(temperatura) < -5 ||
      Number(temperatura) > 45
    ) {
      setZinute("Temperatūra turi būti nuo -5 iki 45 °C.");
      return;
    }

    if (!["Puiki", "Gera", "Bloga"].includes(kokybe)) {
      setZinute("Pasirinkite tinkamą vandens kokybę.");
      return;
    }

    if (!["Žalia", "Geltona", "Raudona"].includes(bangavimas)) {
      setZinute("Pasirinkite tinkamą bangavimo būseną.");
      return;
    }

    try {
      const atsakymas = await fetch("http://localhost:5000/api/stebejimai", {
        method: "POST",
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
      });

      const duomenys = await atsakymas.json();

      if (!atsakymas.ok) {
        throw new Error(duomenys.message || "Nepavyko išsaugoti stebėjimo.");
      }

      setZinute("Stebėjimas sėkmingai išsaugotas!");
      setData("");
      setTemperatura("");
      setKokybe("Gera");
      setBangavimas("Žalia");
      setPastabos("");
    } catch (error) {
      setZinute(error.message || "Įvyko klaida.");
    }
  }

  return (
    <div>
      <h2>Naujas vandens stebėjimas</h2>

      <form onSubmit={pateiktiForma}>
        <label>
          Paplūdimys:
          <select
            value={papludimys}
            onChange={(event) => setPapludimys(event.target.value)}
            required
          >
            <option value="">Pasirink paplūdimį</option>
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
          (Number(temperatura) < -5 || Number(temperatura) > 45) && (
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
            <option value="Žalia">Žalia – saugu maudytis</option>
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

        <button type="submit" disabled={papludimiai.length === 0}>
          Išsaugoti stebėjimą
        </button>
      </form>

      {zinute && <p>{zinute}</p>}
    </div>
  );
}

export default NaujasStebejimas;
