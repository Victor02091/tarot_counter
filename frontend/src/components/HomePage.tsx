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

  const buttonClass =
    "w-full p-3 mb-4 bg-brand-primary text-white rounded-lg font-semibold transition-colors hover:bg-brand-primary-hover";

  return (
    <div>
      <button className={buttonClass} onClick={onStart}>
        Nouvelle partie
      </button>
      <button
        className={buttonClass}
        onClick={() => (window.location.href = "/resume")}
      >
        Reprendre une partie existante
      </button>
      <button className={buttonClass} onClick={() => setShowAddPlayer(true)}>
        Créer un nouveau profil de joueur
      </button>

      {showAddPlayer && (
        <AddPlayerForm
          onCancel={() => setShowAddPlayer(false)}
          onSubmit={handleAddPlayer}
        />
      )}

      {players.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Joueurs existants :</h3>
          <ul className="list-disc pl-5">
            {players.map((p, i) => (
              <li key={i} className="mb-1">
                {p.first_name} {p.last_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;
