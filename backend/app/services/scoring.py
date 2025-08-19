from typing import Dict
from app.models.party_results import PartyResult, ContractType, ChlemType

CONTRACT_MULTIPLIERS = {
    ContractType.petite: 1,
    ContractType.garde: 2,
    ContractType.garde_sans: 4,
    ContractType.garde_contre: 6,
}

OUDLER_THRESHOLDS = {0: 56, 1: 51, 2: 41, 3: 36}

POIGNEE_POINTS = {
    "simple": 20,
    "double": 30,
    "triple": 40,
}

MISERE_POINTS = {
    "tete": 10,
    "atout": 10,
}

CHLEM_POINTS = {
    ChlemType.announced_and_won: 400,
    ChlemType.non_announced_and_won: 200,
    ChlemType.announced_and_failed: -200,
}


def compute_party_result_scores(party: PartyResult) -> Dict[int, int]:
    """
    Returns a dict {player_id: score} for this PartyResult
    """

    # 1. Determine base score
    threshold = OUDLER_THRESHOLDS.get(party.oudlers, 56)
    diff = party.points - threshold
    base_score = diff + 25

    # 2. Petit au bout
    if party.petit_au_bout_player:
        if party.petit_au_bout_won:
            base_score += 10
        else:
            base_score -= 10

    # 3. Apply contract multiplier
    coef = CONTRACT_MULTIPLIERS[party.contract]
    score = base_score * coef

    # 4. Poignées
    score += len(party.poignee_simple_players_ids) * POIGNEE_POINTS["simple"]
    score += len(party.poignee_double_players_ids) * POIGNEE_POINTS["double"]
    score += len(party.poignee_triple_players_ids) * POIGNEE_POINTS["triple"]


    # 5. Chlem
    if party.chlem:
        score += CHLEM_POINTS[party.chlem]

    # 6. Distribute points
    session_players = [
        p for p in [
            party.game_session.player_1,
            party.game_session.player_2,
            party.game_session.player_3,
            party.game_session.player_4,
            party.game_session.player_5
        ] if p
    ]
    results = {p.id: 0 for p in session_players}

    # Main game
    results[party.taker_id] += score * 2
    results[party.called_player_id] += score

    defenders = [pid for pid in results.keys() if pid not in (party.taker_id, party.called_player_id)]
    for d in defenders:
        results[d] -= score

    # Add misère bonuses individually
    for pid in party.misere_tete_players_ids:
        results[pid] += MISERE_POINTS["tete"]
    for pid in party.misere_atout_players_ids:
        results[pid] += MISERE_POINTS["atout"]

    return results
