import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSessionById } from "../services/api";

export default function SessionDetails() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setErr("");

    getGameSessionById(sessionId)
      .then(setSession)
      .catch((e) => setErr(e.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div>{err}</div>;
  if (!session) return <div>Session introuvable</div>;

  // Compute display names for players
  const playersWithNames = session.players.map((p) => ({
    ...p,
    displayName: `${p.first_name} ${p.last_name}`,
  }));

  return (
    <div>
      <h2>{session.name || `Session ${session.id}`}</h2>

      <table>
        <thead>
          <tr>
            {playersWithNames.map((p, i) => (
              <th key={i}>
                {p.displayName} ({session.scores[i]?.score || 0})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {session.party_results.map((pr) => (
            <tr key={pr.id}>
              {playersWithNames.map((p, idx) => {
                const scoreObj = pr.scores?.find((s) => s.player_id === p.id);
                return <td key={idx}>{scoreObj?.score || 0}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          className="btn-primary"
          onClick={() =>
            navigate(`/party/${session.id}`, {
              state: { players: playersWithNames },
            })
          }
        >
          ➕ Ajouter une partie
        </button>
      </div>
    </div>
  );
}
