const API_URL = "http://localhost:8000/api";

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  visible?: boolean;
}

export interface NewPlayer {
  first_name: string;
  last_name: string;
}

export interface GameSession {
  id: number;
  name: string | null;
  player_1_id: number;
  player_2_id: number;
  player_3_id: number;
  player_4_id: number;
  player_5_id: number;
  create_timestamp: string;
  nb_parties: number;
  players?: (Player & { displayName: string })[];
  party_results: PartyResult[];
  scores: PlayerScore[];
}

export interface NewGameSession {
  name: string | null;
  player_1_id: number;
  player_2_id: number;
  player_3_id: number;
  player_4_id: number;
  player_5_id: number;
}

export interface PartyResult {
  id?: number;
  game_session_id: number;
  taker_id: number;
  called_player_id: number;
  contract: string;
  oudlers: number;
  points: number;
  petit_au_bout_player_id: number | null;
  petit_au_bout_won: boolean | null;
  poignee_simple_players_ids: number[];
  poignee_double_players_ids: number[];
  poignee_triple_players_ids: number[];
  misere_tete_players_ids: number[];
  misere_atout_players_ids: number[];
  chlem: string | null;
  scores?: PlayerScore[];
}

export interface PlayerScore {
  player_id: number;
  player?: string;
  score: number;
}

export async function submitPartyResult(result: PartyResult): Promise<PartyResult> {
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

export async function addPlayer(player: NewPlayer): Promise<Player> {
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

export async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${API_URL}/players/`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  const players: Player[] = await res.json();

  // Sort alphabetically by last_name then first_name (case-insensitive)
  players.sort((a, b) => {
    const nameA = `${a.last_name.toLowerCase()} ${a.first_name.toLowerCase()}`;
    const nameB = `${b.last_name.toLowerCase()} ${b.first_name.toLowerCase()}`;
    return nameA.localeCompare(nameB);
  });

  return players;
}

export async function createGameSession(session: NewGameSession): Promise<GameSession> {
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

export async function getGameSessions(skip = 0, limit = 20): Promise<GameSession[]> {
  const res = await fetch(`${API_URL}/game-sessions?skip=${skip}&limit=${limit}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return await res.json();
}

export async function getGameSessionById(id: string | number): Promise<GameSession> {
  const res = await fetch(`${API_URL}/game-sessions/${id}`);
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return await res.json();
}

export async function deleteGameSession(sessionId: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/game-sessions/${sessionId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur serveur");
  }

  return true;
}
