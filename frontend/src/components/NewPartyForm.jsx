import { useState, useEffect } from "react";
import AddPlayerForm from "./AddPlayerForm";
import { getPlayers } from "../services/api";
import "./NewPartyForm.css";

function NewPartyForm({ onNext }) {
  const [partyName, setPartyName] = useState("");
  const [players, setPlayers] = useState(Array(5).fill(""));
  const [allPlayers, setAllPlayers] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
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
    updated[index] = value;
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
    if (players.some((id) => id === "")) return;

    const selectedPlayers = players
      .map((id) => {
        const found = allPlayers.find((pl) => String(pl.id) === String(id));
        return found ? { first: found.first_name, last: found.last_name } : null;
      })
      .filter(Boolean);

    let displayNames = selectedPlayers.map((p) => p.first);

    let letterCount = 1;
    let duplicatesExist = true;

    while (duplicatesExist) {
      const seen = new Map();
      duplicatesExist = false;

      displayNames = displayNames.map((name, idx) => {
        const p = selectedPlayers[idx];
        if (seen.has(name)) {
          duplicatesExist = true;
          const prevIdx = seen.get(name);
          displayNames[prevIdx] = `${selectedPlayers[prevIdx].first} ${selectedPlayers[prevIdx].last.slice(0, letterCount)}.`;
          return `${p.first} ${p.last.slice(0, letterCount)}.`;
        } else {
          seen.set(name, idx);
          return name;
        }
      });

      if (duplicatesExist) letterCount++;
    }

    onNext({ partyName, players: displayNames });
  };

  const allPlayersSelected = !players.some((id) => id === "");

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

      {/* Players selection */}
      <fieldset className="players-fieldset">
        <legend>Joueurs</legend>
        <div className="players-grid">
          {players.map((selectedId, i) => {
            const selectedOtherIds = players.filter((_, idx) => idx !== i);

            return (
              <select
                key={i}
                value={selectedId}
                onChange={(e) => handleChange(i, e.target.value)}
              >
                <option value="">
                  Joueur {i + 1}
                </option>
                {allPlayers
                  .filter((player) => !selectedOtherIds.includes(String(player.id)))
                  .map((player) => (
                    <option key={player.id} value={String(player.id)}>
                      {player.first_name} {player.last_name}
                    </option>
                  ))}
              </select>
            );
          })}
        </div>

        {/* Add player button, hidden if adding */}
        {!showAddPlayer && (
          <div style={{ margin: "1rem 0" }}>
            <button type="button" onClick={() => setShowAddPlayer(true)}>
              Créer un nouveau profil de joueur
            </button>
          </div>
        )}

        {/* Add player form */}
        {showAddPlayer && (
          <AddPlayerForm
            onCancel={() => setShowAddPlayer(false)}
            onSubmit={handleAddPlayer}
          />
        )}
      </fieldset>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!allPlayersSelected}
        className={allPlayersSelected ? "active-button" : "disabled-button"}
      >
        Commencer la partie
      </button>
    </div>
  );
}

export default NewPartyForm;
