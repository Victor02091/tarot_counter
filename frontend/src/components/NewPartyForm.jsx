import { useState, useEffect } from "react";
import AddPlayerForm from "./AddPlayerForm";
import { getPlayers } from "../services/api";

function NewPartyForm({ onNext }) {
  // Name of the party
  const [partyName, setPartyName] = useState("");
  // Store 5 selected player IDs (as strings for easier comparison)
  const [players, setPlayers] = useState(Array(5).fill(""));
  // All available players from backend
  const [allPlayers, setAllPlayers] = useState([]);
  // Control whether AddPlayerForm modal is shown
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  // Load all players from backend when component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers(); // [{ id, first_name, last_name }, ...]
        // Sort players alphabetically by last name, then first name
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

  // Handle player selection change in one of the dropdowns
  const handleChange = (index, value) => {
    const updated = [...players];
    updated[index] = value; // Store the selected player's ID as a string
    setPlayers(updated);
  };

  // Handle adding a new player profile
  const handleAddPlayer = (player) => {
    alert(`Nouveau profil créé: ${player.first_name} ${player.last_name}`);
    setShowAddPlayer(false);
    // Add new player to list and re-sort
    setAllPlayers((prev) =>
      [...prev, player].sort((a, b) => {
        const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
        const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      })
    );
  };

  // Prepare data and send it to parent when "Continuer" is clicked
  const handleContinue = () => {
    // Map selected IDs to player objects
    const selectedPlayers = players
      .map((id) => {
        const found = allPlayers.find((pl) => String(pl.id) === String(id));
        return found ? { first: found.first_name, last: found.last_name } : null;
      })
      .filter(Boolean); // Remove empty selections

    // Start with first names
    let displayNames = selectedPlayers.map((p) => p.first);

    // If two players have the same first name, add letters from their last name until unique
    let letterCount = 1;
    let duplicatesExist = true;

    while (duplicatesExist) {
      const seen = new Map();
      duplicatesExist = false;

      displayNames = displayNames.map((name, idx) => {
        const p = selectedPlayers[idx];
        if (seen.has(name)) {
          // Duplicate found → mark as needing expansion
          duplicatesExist = true;
          const prevIdx = seen.get(name);
          // Update both current and previous entries with part of last name
          displayNames[prevIdx] = `${selectedPlayers[prevIdx].first} ${selectedPlayers[prevIdx].last.slice(0, letterCount)}.`;
          return `${p.first} ${p.last.slice(0, letterCount)}.`;
        } else {
          seen.set(name, idx);
          return name;
        }
      });

      // If still duplicates, increase the number of last name letters
      if (duplicatesExist) {
        letterCount++;
      }
    }

    // Send result to parent component
    onNext({ partyName, players: displayNames });
  };

  return (
    <div>
      <h2>Démarrer une nouvelle partie</h2>

      {/* Party name input */}
      <label>
        Nom de la partie :
        <input
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
      </label>

      <h3>Joueurs :</h3>
      {players.map((selectedId, i) => {
        // Get IDs already selected in other dropdowns (to prevent duplicates)
        const selectedOtherIds = players.filter((_, idx) => idx !== i);

        return (
          <div key={i}>
            <select
              value={selectedId}
              onChange={(e) => handleChange(i, e.target.value)}
            >
              {/* Dynamic placeholder text for each dropdown */}
              <option value="">
                Sélectionnez le joueur {i + 1}
              </option>
              {/* Filter available players to remove already selected ones */}
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

      {/* Button to create a new player profile */}
      <div style={{ margin: "1rem 0" }}>
        <button type="button" onClick={() => setShowAddPlayer(true)}>
          Créer un nouveau profil de joueur
        </button>
      </div>

      {/* Modal for adding new player */}
      {showAddPlayer && (
        <AddPlayerForm
          onCancel={() => setShowAddPlayer(false)}
          onSubmit={handleAddPlayer}
        />
      )}

      {/* Continue button */}
      <button onClick={handleContinue}>Continuer</button>
    </div>
  );
}

export default NewPartyForm;
