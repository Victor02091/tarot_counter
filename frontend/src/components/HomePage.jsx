import { useState } from "react";
import AddPlayerForm from "./AddPlayerForm";

function HomePage({ onStart }) {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [players, setPlayers] = useState([]);

  const handleAddPlayer = (player) => {
    setPlayers([...players, player]);
    setShowAddPlayer(false);
  };

  return (
    <div>
      <button onClick={onStart}>Nouvelle partie</button>
      <button onClick={() => setShowAddPlayer(true)}>Ajouter un joueur</button>

      {showAddPlayer && (
        <AddPlayerForm
          onCancel={() => setShowAddPlayer(false)}
          onSubmit={handleAddPlayer}
        />
      )}

      {players.length > 0 && (
        <div>
          <h3>Joueurs existants :</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>
                {p.firstName} {p.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;
