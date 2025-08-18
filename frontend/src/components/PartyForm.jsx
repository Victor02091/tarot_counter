import { useState } from "react";
import { submitPartyResult } from "../services/api";
import "./PartyForm.css";

function PartyForm({ players }) {
  const [taker, setTaker] = useState("");
  const [called, setCalled] = useState("");
  const [contract, setContract] = useState("");
  const [oudlers, setOudlers] = useState(0);
  const [points, setPoints] = useState(50);
  const [petitPlayer, setPetitPlayer] = useState("");
  const [petitResult, setPetitResult] = useState("");
  const [poignees, setPoignees] = useState({
    simple: [],
    double: [],
    triple: [],
  });
  const [miseres, setMiseres] = useState({ atout: [], tete: [] });
  const [chlem, setChlem] = useState("");

  const toggleMisere = (type, player) => {
    setMiseres((prev) => {
      const updated = prev[type].includes(player)
        ? prev[type].filter((p) => p !== player)
        : [...prev[type], player];
      return { ...prev, [type]: updated };
    });
  };

  const togglePoignee = (type, player) => {
    setPoignees((prev) => {
      const updated = prev[type].includes(player)
        ? prev[type].filter((p) => p !== player)
        : [...prev[type], player];
      return { ...prev, [type]: updated };
    });
  };

  const togglePetit = (player) => {
    if (petitPlayer !== player) {
      setPetitPlayer(player);
      setPetitResult("gagne");
    } else {
      setPetitResult(petitResult === "gagne" ? "perdu" : "");
      if (petitResult === "") setPetitPlayer("");
    }
  };

  const addPoint = () => setPoints((prev) => Math.min(prev + 1, 91));
  const removePoint = () => setPoints((prev) => Math.max(prev - 1, 0));

  const getTargetScore = () => {
    switch (oudlers) {
      case 0:
        return 56;
      case 1:
        return 51;
      case 2:
        return 41;
      case 3:
        return 36;
      default:
        return 0;
    }
  };

  const target = getTargetScore();
  const diff = points - target;
  const contractWon = diff >= 0;

  const handleSubmit = async () => {
    // --- Validation check ---
    let missing = [];
    if (!taker) missing.push("le preneur");
    if (!called) missing.push("le joueur appelé");
    if (!contract) missing.push("le contrat");

    if (missing.length > 0) {
      alert(
        `Veuillez renseigner ${missing.join(", ").replace(/,([^,]*)$/, " et$1")} pour valider la partie.`
      );
      return;
    }

    const result = {
      taker,
      called,
      contract,
      oudlers,
      points,
      petit: { player: petitPlayer, result: petitResult },
      poignees,
      miseres,
      chlem,
    };

    try {
      await submitPartyResult(result);
      alert("Résultat soumis avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      alert("Erreur lors de l'envoi du résultat");
      return;
    }

    // Reset all states
    setTaker("");
    setCalled("");
    setContract("");
    setOudlers(0);
    setPoints(50);
    setPetitPlayer("");
    setPetitResult("");
    setPoignees({ simple: [], double: [], triple: [] });
    setMiseres({ atout: [], tete: [] });
    setChlem("");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h2>Détails de la partie de Tarot</h2>

      <div className="section">
        <label>Preneur :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={i}
              className={taker === p ? "selected" : ""}
              onClick={() => setTaker(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Joueur appelé :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={i}
              className={called === p ? "selected" : ""}
              onClick={() => setCalled(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Contrat :</label>
        <div className="button-group no-wrap-buttons">
          {["Petite", "Garde", "Garde sans", "Garde contre"].map((c, i) => (
            <button
              key={i}
              className={contract === c ? "selected" : ""}
              onClick={() => setContract(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Nombre de bouts :</label>
        <div className="button-group no-wrap-buttons">
          {[0, 1, 2, 3].map((n) => (
            <button
              key={n}
              className={oudlers === n ? "selected" : ""}
              onClick={() => setOudlers(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="section points-section">
        <label>Points :</label>
        <div className="score-summary-inline">
          <div>
            Attaque
            <br />
            <strong style={{ color: contractWon ? "green" : "red" }}>
              {points}
            </strong>
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: contractWon ? "green" : "red",
              margin: "0 1rem",
            }}
          >
            {contractWon ? `+${diff}` : `${diff}`}
          </div>
          <div>
            Défense
            <br />
            <strong>{91 - points}</strong>
          </div>
        </div>

        <div className="score-control-inline">
          <button className="round-button" onClick={removePoint}>
            -
          </button>
          <input
            type="range"
            min="0"
            max="91"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
          <button className="round-button" onClick={addPoint}>
            +
          </button>
        </div>
      </div>

      <fieldset>
        <legend>Petit au bout</legend>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`petit-${i}`}
              className={
                petitPlayer === p
                  ? petitResult === "gagne"
                    ? "success"
                    : petitResult === "perdu"
                    ? "danger"
                    : "selected"
                  : ""
              }
              onClick={() => togglePetit(p)}
            >
              {p}
              <br />
              {petitPlayer === p && petitResult === "gagne" && (
                <span style={{ color: "green" }}>Gagné</span>
              )}
              {petitPlayer === p && petitResult === "perdu" && (
                <span style={{ color: "red" }}>Perdu</span>
              )}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Poignées</legend>
        {["simple", "double", "triple"].map((type, idx) => (
          <div key={type}>
            <label>
              {type === "simple"
                ? "Simple (8 atouts)"
                : type === "double"
                ? "Double (10 atouts)"
                : "Triple (13 atouts)"}
            </label>
            <div className="button-group no-wrap-buttons">
              {players.map((p, i) => (
                <button
                  key={`${type}-${i}`}
                  className={poignees[type].includes(p) ? "selected" : ""}
                  onClick={() => togglePoignee(type, p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset>
        <legend>Misères</legend>
        <label>Misère d’atout :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`atout-${i}`}
              className={miseres.atout.includes(p) ? "selected" : ""}
              onClick={() => toggleMisere("atout", p)}
            >
              {p}
            </button>
          ))}
        </div>
        <label>Misère de tête :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`tete-${i}`}
              className={miseres.tete.includes(p) ? "selected" : ""}
              onClick={() => toggleMisere("tete", p)}
            >
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Chelem</legend>
        <div className="button-group no-wrap-buttons">
          {["Annoncé et passé", "Non annoncé et passé", "Annoncé et chuté"].map(
            (option, i) => (
              <button
                key={i}
                className={chlem === option ? "selected" : ""}
                onClick={() => setChlem(option)}
              >
                {option}
              </button>
            )
          )}
        </div>
      </fieldset>

      <button onClick={handleSubmit}>Valider la partie</button>
    </div>
  );
}

export default PartyForm;
