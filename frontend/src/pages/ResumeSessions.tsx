import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSessionsWithScoresApiGameSessionsGet,
  deleteGameSessionApiGameSessionsSessionIdDelete,
  type GameSessionSummary,
} from "../api";

export default function ResumeSessions() {
  const [sessions, setSessions] = useState<GameSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [toDelete, setToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await getSessionsWithScoresApiGameSessionsGet();
        if (error) throw error;
        setSessions(data || []);
      } catch (e: any) {
        setErr(e.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const confirmDelete = async (id: number) => {
    try {
      const { error } = await deleteGameSessionApiGameSessionsSessionIdDelete({
        path: {
          session_id: id,
        },
      });
      if (error) throw error;
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setToDelete(null);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Erreur lors de la suppression";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app py-8 px-4">
      <header className="max-w-[680px] mx-auto mb-6">
        <h1 className="text-2xl font-bold mb-2">
          🎲 Reprendre une partie existante
        </h1>
        <p className="text-text-muted">
          Consultez vos sessions précédentes et leurs scores cumulés.
        </p>
      </header>

      {err && (
        <div className="max-w-[680px] mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {err}
        </div>
      )}

      {loading ? (
        <div className="max-w-[680px] mx-auto grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="max-w-[680px] mx-auto text-center py-12">
          <h2 className="text-xl font-bold">Aucune session enregistrée</h2>
          <p className="text-text-muted mt-2">
            Créez une nouvelle partie pour la voir apparaître ici.
          </p>
        </div>
      ) : (
        <div className="max-w-[680px] mx-auto grid gap-4">
          {sessions.map((s) => (
            <article
              key={s.id}
              className="relative group bg-white border border-border-subtle rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-4 cursor-pointer"
              onClick={() => navigate(`/session/${s.id}`)}
            >
              <button
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setToDelete(s.id);
                }}
                title="Supprimer cette session"
              >
                🗑️
              </button>

              <div className="mb-4">
                <h2 className="font-bold text-lg truncate pr-10">
                  {s.name?.trim() || `Session ${s.id}`}
                </h2>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold uppercase tracking-wider">
                    {formatDate(s.create_timestamp)}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-bold uppercase tracking-wider">
                    🎲 {s.nb_parties} partie{s.nb_parties > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3">
                <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-2">
                  Scores cumulés
                </h3>
                <div className="grid gap-2">
                  {s.scores.map((sc, idx) => {
                    const positive = Number(sc.score) >= 0;
                    const initials = sc.player
                      ? sc.player
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "?";

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200">
                            {initials}
                          </div>
                          <span className="text-sm font-semibold truncate max-w-[150px]">
                            {sc.player || "Joueur inconnu"}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-black ${
                            positive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {sc.score}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {toDelete && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Supprimer la session ?</h3>
            <p className="text-text-muted text-sm mb-6">
              Cette action est irréversible. Voulez-vous vraiment supprimer
              cette session ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-100 text-text-main rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                onClick={() => setToDelete(null)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-colors shadow-md"
                onClick={() => confirmDelete(toDelete)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
