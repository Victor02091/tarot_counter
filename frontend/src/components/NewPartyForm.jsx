import { useState } from "react";

function NewPartyForm({ onNext }) {
  const [partyName, setPartyName] = useState("");
  const [players, setPlayers] = useState(Array(5).fill(""));

  const handleChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  return (
    <div>
      <h2>Démarrer une nouvelle partie</h2>
      <label>
        Nom de la partie :
        <input
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
      </label>
      <h3>Joueurs :</h3>
      {players.map((name, i) => (
        <div key={i}>
          <input
            placeholder={`Joueur ${i + 1}`}
            value={name}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
      <button onClick={() => onNext({ partyName, players })}>Continuer</button>
    </div>
  );
}

export default NewPartyForm;
