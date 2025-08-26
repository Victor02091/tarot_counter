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

  const playersWithNames = (session.players || []).map((p) => ({
    ...p,
    displayName: p.first_name || "Joueur",
  }));

  return (
    <div className="session-details">
      <h2>{session.name || `Session ${session.id}`}</h2>

      <table className="session-table">
        <thead>
          <tr>
            {playersWithNames.map((p, i) => (
              <th key={p.id ?? i} title={p.displayName}>
                {p.displayName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {session.party_results.map((pr) => (
            <tr key={pr.id}>
              {playersWithNames.map((p, idx) => {
                const scoreObj = pr.scores?.find((s) => s.player_id === p.id);
                const score = Number(scoreObj?.score ?? 0);
                return (
                  <td
                    key={`${pr.id}-${p.id ?? idx}`}
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
        <tfoot>
          <tr>
            {playersWithNames.map((p, i) => {
              const total = session.scores?.[i]?.score ?? 0;

              // Compute winner/loser
              const totals = session.scores?.map((s) => s.score ?? 0) || [];
              const maxScore = Math.max(...totals);
              const minScore = Math.min(...totals);

              let className = "total-score"; // default
              if (total === maxScore && maxScore !== minScore) className += " total-winner";
              if (total === minScore && maxScore !== minScore) className += " total-loser";

              return (
                <td key={`total-${p.id ?? i}`} className={className}>
                  {total}
                </td>
              );
            })}
          </tr>
        </tfoot>

      </table>

      <div className="actions">
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
