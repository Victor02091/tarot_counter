import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitPartyResult, type PartyResult } from "../services/api";
import "./PartyForm.css";

interface PlayerData {
  id: number;
  displayName: string;
}

interface PartyFormProps {
  players: PlayerData[];
  sessionId: string | number;
}

const PartyForm: React.FC<PartyFormProps> = ({ players, sessionId }) => {
  const navigate = useNavigate();

  const [takerId, setTakerId] = useState<number | null>(null);
  const [calledId, setCalledId] = useState<number | null>(null);
  const [contract, setContract] = useState<string>("");
  const [oudlers, setOudlers] = useState<number>(0);
  const [points, setPoints] = useState<number>(50);
  const [petitPlayerId, setPetitPlayerId] = useState<number | null>(null);
  const [petitResult, setPetitResult] = useState<string>("");
  const [poignees, setPoignees] = useState<{ simple: number[]; double: number[]; triple: number[] }>({ 
    simple: [], double: [], triple: [] 
  });
  const [miseres, setMiseres] = useState<{ atout: number[]; tete: number[] }>({ 
    atout: [], tete: [] 
  });
  const [chlem, setChlem] = useState<string>("");

  const toggleMisere = (type: "atout" | "tete", playerId: number) => {
    setMiseres((prev) => {
      const updated = prev[type].includes(playerId)
        ? prev[type].filter((p) => p !== playerId)
        : [...prev[type], playerId];
      return { ...prev, [type]: updated };
    });
  };

  const togglePoignee = (type: "simple" | "double" | "triple", playerId: number) => {
    setPoignees((prev) => {
      const updated = prev[type].includes(playerId)
        ? prev[type].filter((p) => p !== playerId)
        : [...prev[type], playerId];
      return { ...prev, [type]: updated };
    });
  };

  const togglePetit = (playerId: number) => {
    if (petitPlayerId !== playerId) {
      setPetitPlayerId(playerId);
      setPetitResult("gagne");
    } else {
      setPetitResult(petitResult === "gagne" ? "perdu" : "");
      if (petitResult === "") setPetitPlayerId(null);
    }
  };

  const addPoint = () => setPoints((prev) => Math.min(prev + 1, 91));
  const removePoint = () => setPoints((prev) => Math.max(prev - 1, 0));

  const getTargetScore = () => {
    switch (oudlers) {
      case 0: return 56;
      case 1: return 51;
      case 2: return 41;
      case 3: return 36;
      default: return 0;
    }
  };

  const target = getTargetScore();
  const diff = points - target;
  const contractWon = diff >= 0;

  const handleSubmit = async () => {
    let missing: string[] = [];
    if (takerId === null) missing.push("le preneur");
    if (calledId === null) missing.push("le joueur appelé");
    if (!contract) missing.push("le contrat");
  
    if (missing.length > 0) {
      alert(
        `Veuillez renseigner ${missing.join(", ").replace(/,([^,]*)$/, " et$1")} pour valider la partie.`
      );
      return;
    }
  
    // Map petitResult string to boolean or null
    let petitWon: boolean | null = null;
    if (petitResult === "gagne") petitWon = true;
    else if (petitResult === "perdu") petitWon = false;
  
    const result: PartyResult = {
      game_session_id: Number(sessionId),
      taker_id: takerId!,
      called_player_id: calledId!,
      contract,
      oudlers,
      points,
      petit_au_bout_player_id: petitPlayerId,
      petit_au_bout_won: petitWon,
      poignee_simple_players_ids: poignees.simple,
      poignee_double_players_ids: poignees.double,
      poignee_triple_players_ids: poignees.triple,
      misere_tete_players_ids: miseres.tete,
      misere_atout_players_ids: miseres.atout,
      chlem: chlem || null,
    };
  
    try {
      await submitPartyResult(result);
      // Redirect to session details page
      navigate(`/session/${sessionId}`);
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      alert("Erreur lors de l'envoi du résultat");
    }
  };

  return (
    <div>
      <h2>Détails de la partie de Tarot</h2>

      <div className="section">
        <label>Preneur :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p) => (
            <button
              key={p.id}
              className={takerId === p.id ? "selected" : ""}
              onClick={() => setTakerId(p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Joueur appelé :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p) => (
            <button
              key={p.id}
              className={calledId === p.id ? "selected" : ""}
              onClick={() => setCalledId(p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Contrat :</label>
        <div className="button-group no-wrap-buttons">
          {["Petite", "Garde", "Garde sans", "Garde contre"].map((c) => (
            <button
              key={c}
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
          <button className="round-button" onClick={removePoint}>-</button>
          <input
            type="range"
            min="0"
            max="91"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
          <button className="round-button" onClick={addPoint}>+</button>
        </div>
      </div>

      <fieldset>
        <legend>Petit au bout</legend>
        <div className="button-group no-wrap-buttons">
          {players.map((p) => (
            <button
              key={`petit-${p.id}`}
              className={
                petitPlayerId === p.id
                  ? petitResult === "gagne"
                    ? "success"
                    : petitResult === "perdu"
                    ? "danger"
                    : "selected"
                  : ""
              }
              onClick={() => togglePetit(p.id)}
            >
              {p.displayName}
              <br />
              {petitPlayerId === p.id && petitResult === "gagne" && (
                <span style={{ color: "green" }}>Gagné</span>
              )}
              {petitPlayerId === p.id && petitResult === "perdu" && (
                <span style={{ color: "red" }}>Perdu</span>
              )}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Poignées</legend>
        {(["simple", "double", "triple"] as const).map((type) => (
          <div key={type}>
            <label>
              {type === "simple" ? "Simple (8 atouts)" : type === "double" ? "Double (10 atouts)" : "Triple (13 atouts)"}
            </label>
            <div className="button-group no-wrap-buttons">
              {players.map((p) => (
                <button
                  key={`${type}-${p.id}`}
                  className={poignees[type].includes(p.id) ? "selected" : ""}
                  onClick={() => togglePoignee(type, p.id)}
                >
                  {p.displayName}
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
          {players.map((p) => (
            <button
              key={`atout-${p.id}`}
              className={miseres.atout.includes(p.id) ? "selected" : ""}
              onClick={() => toggleMisere("atout", p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
        <label>Misère de tête :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p) => (
            <button
              key={`tete-${p.id}`}
              className={miseres.tete.includes(p.id) ? "selected" : ""}
              onClick={() => toggleMisere("tete", p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Chelem</legend>
        <div className="button-group no-wrap-buttons">
          {["Annoncé et passé", "Non annoncé et passé", "Annoncé et chuté"].map((option) => (
            <button
              key={option}
              className={chlem === option ? "selected" : ""}
              onClick={() => setChlem(chlem === option ? "" : option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>


      <button onClick={handleSubmit}>Valider la partie</button>
    </div>
  );
}

export default PartyForm;
