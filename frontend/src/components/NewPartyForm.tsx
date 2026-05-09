import React, { useState, useEffect } from "react";
import AddPlayerForm from "./AddPlayerForm";
import { getPlayers, createGameSession, type Player } from "../services/api";

interface NewPartyFormProps {
  onNext: (data: {
    partyName: string | null;
    sessionId: number;
    players: { id: number; displayName: string }[];
  }) => void;
}

const NewPartyForm: React.FC<NewPartyFormProps> = ({ onNext }) => {
  const [partyName, setPartyName] = useState("");
  const [players, setPlayers] = useState<string[]>(Array(5).fill(""));
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
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

  const handleChange = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleAddPlayer = (player: Player) => {
    alert(`Nouveau profil créé: ${player.first_name} ${player.last_name}`);
    setShowAddPlayer(false);
    setAllPlayers((prev) =>
      [...prev, player].sort((a, b) => {
        const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
        const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }),
    );
  };

  const handleContinue = async () => {
    if (players.some((id) => id === "")) return;

    try {
      const session = await createGameSession({
        name: partyName || null,
        player_1_id: parseInt(players[0]),
        player_2_id: parseInt(players[1]),
        player_3_id: parseInt(players[2]),
        player_4_id: parseInt(players[3]),
        player_5_id: parseInt(players[4]),
      });

      const selectedPlayers = players
        .map((id) => allPlayers.find((p) => String(p.id) === String(id)))
        .filter((p): p is Player => !!p);

      let displayNames = selectedPlayers.map((p) => p.first_name);

      let letterCount = 1;
      let duplicatesExist = true;

      while (duplicatesExist) {
        const seen = new Map<string, number>();
        duplicatesExist = false;

        displayNames = displayNames.map((name, idx) => {
          const p = selectedPlayers[idx];
          if (seen.has(name)) {
            duplicatesExist = true;
            const prevIdx = seen.get(name)!;
            displayNames[prevIdx] =
              `${selectedPlayers[prevIdx].first_name} ${selectedPlayers[prevIdx].last_name.slice(0, letterCount)}.`;
            return `${p.first_name} ${p.last_name.slice(0, letterCount)}.`;
          } else {
            seen.set(name, idx);
            return name;
          }
        });

        if (duplicatesExist) letterCount++;
      }

      // Send both id and displayName to PartyForm
      const playerData = selectedPlayers.map((p, idx) => ({
        id: p.id,
        displayName: displayNames[idx],
      }));

      onNext({
        partyName: session.name,
        sessionId: session.id,
        players: playerData,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert("Erreur lors de la création de la partie: " + errorMessage);
    }
  };

  const allPlayersSelected = !players.some((id) => id === "");

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Démarrer une nouvelle partie</h2>

      <div className="mb-6">
        <label className="block mb-1 font-semibold">Nom de la partie :</label>
        <input
          className="w-full p-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          placeholder="Facultatif"
        />
      </div>

      <fieldset className="mb-6 border border-border-subtle p-4 rounded-xl">
        <legend className="px-2 font-bold text-lg">Joueurs</legend>
        <div className="grid gap-4 mt-2">
          {players.map((selectedId, i) => {
            const selectedOtherIds = players.filter((_, idx) => idx !== i);
            return (
              <select
                key={i}
                className="w-full p-4 border-2 border-border-subtle rounded-lg text-lg min-h-[3.5rem] focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                value={selectedId}
                onChange={(e) => handleChange(i, e.target.value)}
              >
                <option value="">Joueur {i + 1}</option>
                {allPlayers
                  .filter(
                    (player) => !selectedOtherIds.includes(String(player.id)),
                  )
                  .map((player) => (
                    <option key={player.id} value={String(player.id)}>
                      {player.first_name} {player.last_name}
                    </option>
                  ))}
              </select>
            );
          })}
        </div>

        {!showAddPlayer && (
          <div className="mt-4">
            <button
              type="button"
              className="w-full p-3 bg-white border border-brand-primary text-brand-primary rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              onClick={() => setShowAddPlayer(true)}
            >
              Créer un nouveau profil de joueur
            </button>
          </div>
        )}

        {showAddPlayer && (
          <AddPlayerForm
            onCancel={() => setShowAddPlayer(false)}
            onSubmit={handleAddPlayer}
          />
        )}
      </fieldset>

      <button
        onClick={handleContinue}
        disabled={!allPlayersSelected}
        className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
          allPlayersSelected
            ? "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md active:scale-[0.98]"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Commencer la partie
      </button>
    </div>
  );
};

export default NewPartyForm;
