import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSessionById, type GameSession } from "../services/api";

export default function SessionDetails() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setErr("");
    getGameSessionById(sessionId)
      .then(setSession)
      .catch((e) => setErr(e.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 animate-pulse text-text-muted">
        Chargement...
      </div>
    );
  if (err)
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
        {err}
      </div>
    );
  if (!session)
    return (
      <div className="text-center py-12 text-text-muted">
        Session introuvable
      </div>
    );

  const playersWithNames = (session.players || []).map((p) => ({
    ...p,
    displayName: p.first_name || "Joueur",
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[#111]">
        {session.name || `Session ${session.id}`}
      </h2>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {playersWithNames.map((p, i) => (
                <th
                  key={p.id ?? i}
                  className="p-3 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 border-b border-indigo-100 first:rounded-tl-xl last:rounded-tr-xl truncate max-w-[80px]"
                  title={p.displayName}
                >
                  {p.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {session.party_results.map((pr) => (
              <tr key={pr.id} className="hover:bg-gray-50/50 transition-colors">
                {playersWithNames.map((p, idx) => {
                  const scoreObj = pr.scores?.find((s) => s.player_id === p.id);
                  const score = Number(scoreObj?.score ?? 0);
                  return (
                    <td
                      key={`${pr.id}-${p.id ?? idx}`}
                      className={`p-3 text-center text-sm font-bold ${
                        score > 0
                          ? "text-green-600"
                          : score < 0
                            ? "text-red-600"
                            : "text-text-muted"
                      }`}
                    >
                      {score}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-600">
              {playersWithNames.map((p, i) => {
                const total = session.scores?.[i]?.score ?? 0;

                // Compute winner/loser
                const totals = session.scores?.map((s) => s.score ?? 0) || [];
                const maxScore = Math.max(...totals);
                const minScore = Math.min(...totals);

                let cellClass = "p-3 text-center text-sm font-black border-t-2";
                if (total === maxScore && maxScore !== minScore) {
                  cellClass += " bg-green-500 text-white border-green-400";
                } else if (total === minScore && maxScore !== minScore) {
                  cellClass += " bg-red-500 text-white border-red-400";
                } else {
                  cellClass += " bg-indigo-700 text-white border-indigo-500";
                }

                if (i === 0) cellClass += " rounded-bl-xl";
                if (i === playersWithNames.length - 1)
                  cellClass += " rounded-br-xl";

                return (
                  <td key={`total-${p.id ?? i}`} className={cellClass}>
                    {total}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="pt-4">
        <button
          className="w-full p-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          onClick={() =>
            navigate(`/party/${session.id}`, {
              state: { players: playersWithNames },
            })
          }
        >
          <span>➕</span>
          <span>Ajouter une partie</span>
        </button>
      </div>
    </div>
  );
}
