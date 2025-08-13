import { useState } from "react";
import AddPlayerForm from "./AddPlayerForm";

function NewPartyForm({ onNext }) {
  const [partyName, setPartyName] = useState("");
  const [players, setPlayers] = useState(Array(5).fill(""));
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleAddPlayer = (player) => {
    alert(`Nouveau profil créé: ${player.firstName} ${player.lastName}`);
    setShowAddPlayer(false);
    // Here you could also automatically assign this new player to one of the 5 fields later
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

      {/* Button to create new player */}
      <div style={{ margin: "1rem 0" }}>
        <button type="button" onClick={() => setShowAddPlayer(true)}>
          Créer un nouveau profil de joueur
        </button>
      </div>

      {/* AddPlayerForm modal */}
      {showAddPlayer && (
        <AddPlayerForm
          onCancel={() => setShowAddPlayer(false)}
          onSubmit={handleAddPlayer}
        />
      )}
      
      <button onClick={() => onNext({ partyName, players })}>Continuer</button>
    </div>
  );
}

export default NewPartyForm;
