from app.services.scoring import compute_party_result_scores
from app.models.party_results import ContractType, ChlemType


class FakePlayer:
    def __init__(self, pid: int):
        self.id = pid


class FakeGameSession:
    def __init__(self):
        self.player_1 = FakePlayer(1)
        self.player_2 = FakePlayer(2)
        self.player_3 = FakePlayer(3)
        self.player_4 = FakePlayer(4) 
        self.player_5 = FakePlayer(5)


class FakePartyResult:
    def __init__(self, **kwargs):
        self.points = kwargs.get("points", 56)
        self.oudlers = kwargs.get("oudlers", 2)
        self.contract = kwargs.get("contract", ContractType.petite)
        self.petit_au_bout_player_id = kwargs.get("petit_au_bout_player_id", None)
        self.petit_au_bout_won = kwargs.get("petit_au_bout_won", False)
        self.poignee_simple_players_ids = kwargs.get("poignee_simple_players_ids", [])
        self.poignee_double_players_ids = kwargs.get("poignee_double_players_ids", [])
        self.poignee_triple_players_ids = kwargs.get("poignee_triple_players_ids", [])
        self.chlem = kwargs.get("chlem", None)
        self.misere_tete_players_ids = kwargs.get("misere_tete_players_ids", [])
        self.misere_atout_players_ids = kwargs.get("misere_atout_players_ids", [])
        self.taker_id = kwargs.get("taker_id", 1)
        self.called_player_id = kwargs.get("called_player_id", 2)
        self.game_session = kwargs.get("game_session", FakeGameSession())



def test_petit_au_bout():
    # Attack wins petit au bout
    party = FakePartyResult( points=52
                            , oudlers=1
                            , contract=ContractType.garde
                            , petit_au_bout_player_id=1
                            , petit_au_bout_won=True)
    scores = compute_party_result_scores(party)
    assert scores=={1: 144, 2: 72, 3: -72, 4: -72, 5: -72}

    # Attack wins but denfense wins petit au bout
    party = FakePartyResult( points=38
                            , oudlers=3
                            , contract=ContractType.garde_sans
                            , petit_au_bout_player_id=3
                            , petit_au_bout_won=True)
    scores = compute_party_result_scores(party)
    assert scores=={1: 136, 2: 68, 3: -68, 4: -68, 5: -68}

    # Attack loose and loose petit au bout
    party = FakePartyResult( points=25
                        , oudlers=0
                        , contract=ContractType.garde_contre
                        , petit_au_bout_player_id=5
                        , petit_au_bout_won=True)
    scores = compute_party_result_scores(party)
    assert scores=={1: -792, 2: -396, 3: 396, 4: 396, 5: 396}

def test_taker_call_himself():
    party = FakePartyResult( points=49
                        , oudlers=2
                        , contract=ContractType.garde_sans
                        , taker_id=4
                        , called_player_id=4
                        , petit_au_bout_player_id=2
                        , petit_au_bout_won=False)
    scores = compute_party_result_scores(party)
    assert scores=={1: -172, 2: -172, 3: -172, 4: 688, 5: -172}




