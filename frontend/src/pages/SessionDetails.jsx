import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSessionById } from "../services/api";
import "./SessionDetails.css";

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
    <div className="session-details">
      <h2>{session.name || `Session ${session.id}`}</h2>

      <div className="table-wrapper">
        <table className="session-table">
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
                  const score = scoreObj?.score || 0;
                  return (
                    <td
                      key={idx}
                      className={
                        score > 0 ? "score-pos" : score < 0 ? "score-neg" : ""
                      }
                    >
                      {score}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center" }}>
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
