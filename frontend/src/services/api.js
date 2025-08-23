const API_URL = "http://localhost:8000/api";

export async function submitPartyResult(result) {
  const res = await fetch(`${API_URL}/party-results/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return await res.json();
}

export async function addPlayer(player) {
  const res = await fetch(`${API_URL}/players/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return await res.json();
}

export async function getPlayers() {
  const res = await fetch(`${API_URL}/players/`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  const players = await res.json();

  // Sort alphabetically by last_name then first_name (case-insensitive)
  players.sort((a, b) => {
    const nameA = `${a.last_name.toLowerCase()} ${a.first_name.toLowerCase()}`;
    const nameB = `${b.last_name.toLowerCase()} ${b.first_name.toLowerCase()}`;
    return nameA.localeCompare(nameB);
  });

  return players;
}

export async function createGameSession(session) {
  const res = await fetch(`${API_URL}/game-sessions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return await res.json();
}

export async function getGameSessions(skip = 0, limit = 20) {
  const res = await fetch(`${API_URL}/game-sessions?skip=${skip}&limit=${limit}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return await res.json();
}

export async function getGameSessionById(id) {
  const res = await fetch(`${API_URL}/game-sessions/${id}`);
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return await res.json();
}