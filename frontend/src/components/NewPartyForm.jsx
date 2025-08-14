import { useState, useEffect } from "react";
import AddPlayerForm from "./AddPlayerForm";
import { getPlayers } from "../services/api";

function NewPartyForm({ onNext }) {
  const [partyName, setPartyName] = useState("");
  const [players, setPlayers] = useState(Array(5).fill("")); // store selected player IDs as strings
  const [allPlayers, setAllPlayers] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  // Fetch players from backend on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers(); // [{ id, first_name, last_name }, ...]
        // Sort alphabetically by last_name then first_name
        data.sort((a, b) => {
          const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
          const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setAllPlayers(data);
      } catch (err) {
        console.error("Erreur lors du chargement des joueurs :", err);
      }
    };
    fetchPlayers();
  }, []);

  const handleChange = (index, value) => {
    const updated = [...players];
    updated[index] = value; // value is a string from <select>
    setPlayers(updated);
  };

  const handleAddPlayer = (player) => {
    alert(`Nouveau profil créé: ${player.first_name} ${player.last_name}`);
    setShowAddPlayer(false);
    setAllPlayers((prev) =>
      [...prev, player].sort((a, b) => {
        const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
        const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      })
    );
  };

  const toFullName = (p) => `${p.first_name} ${p.last_name}`.trim();

  const handleContinue = () => {
    const playerNames = players
      .map((id) => {
        const found = allPlayers.find((pl) => String(pl.id) === String(id));
        return found ? toFullName(found) : "";
      })
      .filter(Boolean); // remove empty slots so the questionnaire doesn't get blank buttons
    onNext({ partyName, players: playerNames });
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
      {players.map((selectedId, i) => (
        <div key={i}>
          <select
            value={selectedId}
            onChange={(e) => handleChange(i, e.target.value)}
          >
            <option value="">Sélectionnez un joueur</option>
            {allPlayers.map((player) => (
              <option key={player.id} value={String(player.id)}>
                {player.first_name} {player.last_name}
              </option>
            ))}
          </select>
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

      <button onClick={handleContinue}>Continuer</button>
    </div>
  );
}

export default NewPartyForm;
