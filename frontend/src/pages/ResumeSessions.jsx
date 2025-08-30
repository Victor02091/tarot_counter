import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameSessions, deleteGameSession } from "../services/api";
import "./ResumeSessions.css";

export default function ResumeSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getGameSessions()
      .then((data) => setSessions(data))
      .catch((e) => setErr(e.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const confirmDelete = async (id) => {
      try {
        await deleteGameSession(id); 
        setSessions((prev) => prev.filter((s) => s.id !== id));
        setToDelete(null);
      } catch (e) {
        alert(e.message || "Erreur lors de la suppression");
      }
    };

  return (
    <div className="resume-page">
      <header className="resume-header">
        <h1> 🎲 Reprendre une partie existante</h1>
        <p>Consultez vos sessions précédentes et leurs scores cumulés.</p>
      </header>

      {err && <div className="resume-alert">{err}</div>}

      {loading ? (
        <div className="card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="session-card skeleton">
              <div className="skeleton-line w-60" />
              <div className="skeleton-line w-40" />
              <div className="skeleton-chip" />
              <div className="skeleton-list">
                <div className="skeleton-line w-56" />
                <div className="skeleton-line w-44" />
                <div className="skeleton-line w-52" />
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration" />
          <h2>Aucune session enregistrée</h2>
          <p>Créez une nouvelle partie pour la voir apparaître ici.</p>
        </div>
      ) : (
        <div className="card-grid">
          {sessions.map((s) => (
            <article key={s.id} className="session-card">
              {/* Floating Delete Button */}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setToDelete(s.id);
                }}
                aria-label="Supprimer la session"
                title="Supprimer cette session"
              >
                🗑️
              </button>

              {/* Card content clickable */}
              <div
                className="card-content"
                onClick={() => navigate(`/session/${s.id}`)}
              >
                <div className="session-card__top">
                  <div className="session-card__title">
                    <h2>{s.name?.trim() || `Session ${s.id}`}</h2>
                  </div>

                  <div className="session-card__meta">
                    <span className="chip chip--date">
                      {formatDate(s.create_timestamp)}
                    </span>
                    <span className="chip chip--count">
                      🎲 {s.nb_parties} partie{s.nb_parties > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="divider" />

                <div className="scores">
                  <h3>Scores cumulés</h3>
                  <ul className="score-list">
                    {s.scores.map((sc, idx) => {
                      const initials = sc.player
                        ? sc.player
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "?";
                      const positive = Number(sc.score) >= 0;
                      return (
                        <li key={idx} className="score-item">
                          <div className="score-item__left">
                            <div className="avatar" aria-hidden>
                              {initials}
                            </div>
                            <span className="player-name">
                              {sc.player || "Joueur inconnu"}
                            </span>
                          </div>
                          <span
                            className={`score ${
                              positive ? "score--pos" : "score--neg"
                            }`}
                          >
                            {positive ? "+" : ""}
                            {sc.score}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {toDelete && (
        <div className="modal-backdrop" onClick={() => setToDelete(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Supprimer la session ?</h3>
            <p>
              Cette action est irréversible. Voulez-vous vraiment supprimer cette
              session ?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setToDelete(null)}>
                Annuler
              </button>
              <button
                className="btn-danger"
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
