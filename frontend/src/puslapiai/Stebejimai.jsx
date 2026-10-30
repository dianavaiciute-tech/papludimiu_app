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
    } catch {
      setKlaida("Nepavyko įkelti vandens stebėjimų.");
    }
  }

  useEffect(() => {
    async function uzkrautiDuomenis() {
      await gautiStebejimus();
    }

    uzkrautiDuomenis();
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
    <div className="stebejimu-puslapis">
      <div className="stebejimu-antraste">
        <div>
          <h1>Vandens stebėjimai</h1>
          <p>Peržiūrėk Lietuvos pajūrio vandens būklės duomenis.</p>
        </div>

        <button onClick={() => (window.location.href = "/stebejimai/naujas")}>
          + Naujas stebėjimas
        </button>
      </div>

      {klaida && <p className="klaidos-pranesimas">{klaida}</p>}
      {zinute && <p className="sekmes-pranesimas">{zinute}</p>}

      {!klaida && stebejimai.length === 0 && (
        <div className="tuscias-pranesimas">
          <h3>Stebėjimų kol kas nėra</h3>
          <p>Pridėk naują stebėjimą, kad čia matytum vandens duomenis.</p>
        </div>
      )}

      <div className="stebejimu-sarasas">
        {stebejimai.map((stebejimas) => (
          <article className="stebejimo-kortele" key={stebejimas._id}>
            <div className="stebejimo-korteles-virsus">
              <h3>
                {typeof stebejimas.papludimys === "object" &&
                stebejimas.papludimys !== null
                  ? stebejimas.papludimys.pavadinimas
                  : "Paplūdimys nerastas"}
              </h3>

              <p className="stebejimo-vieta">
                {typeof stebejimas.papludimys === "object" &&
                stebejimas.papludimys !== null
                  ? stebejimas.papludimys.miestas
                  : ""}
              </p>

              <span className="stebejimo-data">
                {new Date(stebejimas.data).toLocaleString("lt-LT")}
              </span>
            </div>

            <div className="stebejimo-duomenys">
              <div className="stebejimo-duomuo">
                <span>Vandens temperatūra</span>
                <strong>{stebejimas.vandensTemperatura} °C</strong>
              </div>

              <div className="stebejimo-duomuo">
                <span>Vandens kokybė</span>
                <strong>{stebejimas.vandensKokybe}</strong>
              </div>

              <div className="stebejimo-duomuo">
                <span>Bangavimas</span>
                <strong>{stebejimas.bangavimas}</strong>
              </div>
            </div>

            {stebejimas.pastabos && (
              <p className="stebejimo-pastabos">
                <strong>Pastabos:</strong> {stebejimas.pastabos}
              </p>
            )}

            <div className="stebejimo-veiksmai">
              <button
                className="redagavimo-mygtukas"
                onClick={() =>
                  (window.location.href = `/stebejimai/redaguoti/${stebejimas._id}`)
                }
              >
                Redaguoti
              </button>

              <button
                className="trynimo-mygtukas"
                onClick={() => istrintiStebejima(stebejimas._id)}
              >
                Ištrinti
              </button>
            </div>
          </article>
        ))}
      </div>
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
    </div>
  );
}

export default Stebejimai;
