import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGameSessionById, getPlayers, submitPartyResult } from "../services/api";

export default function SessionDetails() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");

    // Fetch session details
    getGameSessionById(sessionId)
      .then(setSession)
      .catch((e) => setErr(e.message || "Erreur de chargement"))
      .finally(() => setLoading(false));

    // Fetch all players
    getPlayers()
      .then(setPlayers)
      .catch((e) => console.error(e.message));
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div>{err}</div>;
  if (!session) return <div>Session introuvable</div>;

  return (
    <div>
      <h2>{session.name || `Session ${session.id}`}</h2>

      <table>
        <thead>
          <tr>
            {session.players.map((p, i) => (
              <th key={i}>
                {p} ({session.scores[i]?.score || 0})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {session.party_results.map((pr) => (
            <tr key={pr.id}>
              {session.players.map((p, idx) => {
                const scoreObj = session.scores.find((s) => s.player === p);
                return <td key={idx}>{scoreObj?.score || 0}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Ajouter une partie</h3>
      <PartyResultForm sessionId={session.id} players={players} />
    </div>
  );
}

// Form component for adding a new party result
function PartyResultForm({ sessionId, players }) {
  const [form, setForm] = useState({
    taker_id: players[0]?.id || "",
    called_player_id: players[1]?.id || "",
    contract: "Petite",
    oudlers: 0,
    points: 0,
    poignee_simple_players_ids: [],
    poignee_double_players_ids: [],
    poignee_triple_players_ids: [],
    misere_tete_players_ids: [],
    misere_atout_players_ids: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitPartyResult({ ...form, game_session_id: sessionId });
      alert("Partie ajoutée !");
      window.location.reload(); // reload to refresh data
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="taker_id" onChange={handleChange} value={form.taker_id}>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.first_name} {p.last_name}
          </option>
        ))}
      </select>

      <select name="called_player_id" onChange={handleChange} value={form.called_player_id}>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.first_name} {p.last_name}
          </option>
        ))}
      </select>

      <input type="number" name="points" value={form.points} onChange={handleChange} />

      <button type="submit">Ajouter</button>
    </form>
  );
}
