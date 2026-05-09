import React, { useState } from "react";
import AddPlayerForm from "./AddPlayerForm";
import { type Player } from "../services/api";

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  const handleAddPlayer = (player: Player) => {
    setPlayers([...players, player]);
    setShowAddPlayer(false);
  };

  return (
    <div>
      <button onClick={onStart}>Nouvelle partie</button>
      <button onClick={() => window.location.href="/resume"}>Reprendre une partie existante</button>
      <button onClick={() => setShowAddPlayer(true)}>Créer un nouveau profil de joueur</button>
      


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
                {p.first_name} {p.last_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;
