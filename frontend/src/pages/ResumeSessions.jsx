import { useEffect, useState } from "react";
import { getGameSessions } from "../services/api";

export default function ResumeSessionsPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getGameSessions()
      .then(setSessions)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Reprendre une partie existante</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[80vh]">
        {sessions.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">
              {s.name || `Session #${s.id}`}
            </h2>
            <p className="text-sm text-gray-500">
              Créée le {new Date(s.create_timestamp).toLocaleDateString()}
            </p>
            <p className="mt-2 text-sm">Nombre de parties : {s.nb_parties}</p>

            <div className="mt-3">
              <h3 className="font-medium">Scores :</h3>
              <ul className="text-sm text-gray-700 mt-1">
                {s.scores.map((sc, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{sc.player}</span>
                    <span className="font-bold">{sc.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
