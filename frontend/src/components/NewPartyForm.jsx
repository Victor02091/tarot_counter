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

  const handleContinue = () => {
    const selectedPlayers = players
      .map((id) => {
        const found = allPlayers.find((pl) => String(pl.id) === String(id));
        return found ? { first: found.first_name, last: found.last_name } : null;
      })
      .filter(Boolean); // remove empty slots

    // Step 1: start with first names
    let displayNames = selectedPlayers.map((p) => p.first);

    // Step 2: resolve duplicates by adding letters from last name
    let letterCount = 1;
    let duplicatesExist = true;

    while (duplicatesExist) {
      const seen = new Map();
      duplicatesExist = false;

      displayNames = displayNames.map((name, idx) => {
        const p = selectedPlayers[idx];
        if (seen.has(name)) {
          // Already seen → need to expand last name for both
          duplicatesExist = true;

          // Update the previous occurrence too
          const prevIdx = seen.get(name);
          displayNames[prevIdx] = `${selectedPlayers[prevIdx].first} ${selectedPlayers[prevIdx].last.slice(0, letterCount)}.`;

          // Return updated for current one
          return `${p.first} ${p.last.slice(0, letterCount)}.`;
        } else {
          seen.set(name, idx);
          return name;
        }
      });

      if (duplicatesExist) {
        letterCount++;
      }
    }

    onNext({ partyName, players: displayNames });
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
      {players.map((selectedId, i) => {
        // Compute IDs already selected in other dropdowns
        const selectedOtherIds = players.filter((_, idx) => idx !== i);

        return (
          <div key={i}>
            <select
              value={selectedId}
              onChange={(e) => handleChange(i, e.target.value)}
            >
              <option value="">Sélectionnez un joueur</option>
              {allPlayers
                .filter((player) => !selectedOtherIds.includes(String(player.id)))
                .map((player) => (
                  <option key={player.id} value={String(player.id)}>
                    {player.first_name} {player.last_name}
                  </option>
                ))}
            </select>
          </div>
        );
      })}

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
