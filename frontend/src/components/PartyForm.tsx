import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitPartyResult, type PartyResult } from "../services/api";

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
  const [poignees, setPoignees] = useState<{
    simple: number[];
    double: number[];
    triple: number[];
  }>({
    simple: [],
    double: [],
    triple: [],
  });
  const [miseres, setMiseres] = useState<{ atout: number[]; tete: number[] }>({
    atout: [],
    tete: [],
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

  const togglePoignee = (
    type: "simple" | "double" | "triple",
    playerId: number,
  ) => {
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
    const missing: string[] = [];
    if (takerId === null) missing.push("le preneur");
    if (calledId === null) missing.push("le joueur appelé");
    if (!contract) missing.push("le contrat");

    if (missing.length > 0) {
      alert(
        `Veuillez renseigner ${missing.join(", ").replace(/,([^,]*)$/, " et$1")} pour valider la partie.`,
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

  const groupClass = "flex flex-nowrap gap-1 mt-2 mb-4 overflow-x-auto pb-2";
  const buttonBaseClass =
    "flex-1 min-w-[70px] p-2 text-[10px] sm:text-xs font-semibold border rounded-lg transition-all cursor-pointer text-center whitespace-nowrap";
  const getButtonClass = (selected: boolean) =>
    `${buttonBaseClass} ${
      selected
        ? "bg-brand-primary text-white border-brand-primary"
        : "bg-white text-brand-primary border-brand-primary hover:bg-gray-50"
    }`;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Détails de la partie</h2>

      <section>
        <label className="block font-bold">Preneur :</label>
        <div className={groupClass}>
          {players.map((p) => (
            <button
              key={p.id}
              className={getButtonClass(takerId === p.id)}
              onClick={() => setTakerId(p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label className="block font-bold">Joueur appelé :</label>
        <div className={groupClass}>
          {players.map((p) => (
            <button
              key={p.id}
              className={getButtonClass(calledId === p.id)}
              onClick={() => setCalledId(p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label className="block font-bold">Contrat :</label>
        <div className={groupClass}>
          {["Petite", "Garde", "Garde sans", "Garde contre"].map((c) => (
            <button
              key={c}
              className={getButtonClass(contract === c)}
              onClick={() => setContract(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label className="block font-bold">Nombre de bouts :</label>
        <div className={groupClass}>
          {[0, 1, 2, 3].map((n) => (
            <button
              key={n}
              className={getButtonClass(oudlers === n)}
              onClick={() => setOudlers(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <section className="p-4 bg-gray-50 rounded-xl">
        <label className="block font-bold mb-4">Points :</label>
        <div className="flex items-center justify-center gap-8 mb-6 text-center">
          <div>
            <div className="text-xs uppercase text-text-muted">Attaque</div>
            <div
              className={`text-2xl font-black ${
                contractWon ? "text-green-600" : "text-red-600"
              }`}
            >
              {points}
            </div>
          </div>
          <div
            className={`text-lg font-bold ${
              contractWon ? "text-green-600" : "text-red-600"
            }`}
          >
            {contractWon ? `+${diff}` : `${diff}`}
          </div>
          <div>
            <div className="text-xs uppercase text-text-muted">Défense</div>
            <div className="text-2xl font-black text-gray-800">
              {91 - points}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="w-10 h-10 flex items-center justify-center bg-white border border-border-subtle rounded-full shadow-sm active:scale-95"
            onClick={removePoint}
          >
            -
          </button>
          <input
            type="range"
            min="0"
            max="91"
            className="flex-1 accent-brand-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
          <button
            className="w-10 h-10 flex items-center justify-center bg-white border border-border-subtle rounded-full shadow-sm active:scale-95"
            onClick={addPoint}
          >
            +
          </button>
        </div>
      </section>

      <fieldset className="border border-border-subtle p-4 rounded-xl">
        <legend className="px-2 font-bold">Petit au bout</legend>
        <div className={groupClass}>
          {players.map((p) => {
            const isSelected = petitPlayerId === p.id;
            let bgColor = "bg-white";
            let textColor = "text-brand-primary";
            let borderColor = "border-brand-primary";

            if (isSelected) {
              if (petitResult === "gagne") {
                bgColor = "bg-green-600";
                textColor = "text-white";
                borderColor = "border-green-600";
              } else if (petitResult === "perdu") {
                bgColor = "bg-red-600";
                textColor = "text-white";
                borderColor = "border-red-600";
              } else {
                bgColor = "bg-brand-primary";
                textColor = "text-white";
                borderColor = "border-brand-primary";
              }
            }

            return (
              <button
                key={`petit-${p.id}`}
                className={`${buttonBaseClass} ${bgColor} ${textColor} ${borderColor}`}
                onClick={() => togglePetit(p.id)}
              >
                {p.displayName}
                {isSelected && (
                  <div className="text-[10px] uppercase mt-1">
                    {petitResult === "gagne" ? "Gagné" : "Perdu"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border border-border-subtle p-4 rounded-xl">
        <legend className="px-2 font-bold">Poignées</legend>
        {(["simple", "double", "triple"] as const).map((type) => (
          <div key={type} className="mb-4 last:mb-0">
            <label className="text-sm font-semibold text-text-muted mb-1 block">
              {type === "simple"
                ? "Simple (8 atouts)"
                : type === "double"
                  ? "Double (10 atouts)"
                  : "Triple (13 atouts)"}
            </label>
            <div className={groupClass}>
              {players.map((p) => (
                <button
                  key={`${type}-${p.id}`}
                  className={getButtonClass(poignees[type].includes(p.id))}
                  onClick={() => togglePoignee(type, p.id)}
                >
                  {p.displayName}
                </button>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="border border-border-subtle p-4 rounded-xl">
        <legend className="px-2 font-bold">Misères</legend>
        <label className="text-sm font-semibold text-text-muted mb-1 block">
          Misère d’atout :
        </label>
        <div className={groupClass}>
          {players.map((p) => (
            <button
              key={`atout-${p.id}`}
              className={getButtonClass(miseres.atout.includes(p.id))}
              onClick={() => toggleMisere("atout", p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
        <label className="text-sm font-semibold text-text-muted mb-1 block">
          Misère de tête :
        </label>
        <div className={groupClass}>
          {players.map((p) => (
            <button
              key={`tete-${p.id}`}
              className={getButtonClass(miseres.tete.includes(p.id))}
              onClick={() => toggleMisere("tete", p.id)}
            >
              {p.displayName}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-border-subtle p-4 rounded-xl">
        <legend className="px-2 font-bold">Chelem</legend>
        <div className={groupClass}>
          {["Annoncé et passé", "Non annoncé et passé", "Annoncé et chuté"].map(
            (option) => (
              <button
                key={option}
                className={getButtonClass(chlem === option)}
                onClick={() => setChlem(chlem === option ? "" : option)}
              >
                {option}
              </button>
            ),
          )}
        </div>
      </fieldset>

      <button
        onClick={handleSubmit}
        className="w-full p-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-primary-hover active:scale-[0.98] transition-all"
      >
        Valider la partie
      </button>
    </div>
  );
};

export default PartyForm;
