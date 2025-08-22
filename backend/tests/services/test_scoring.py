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

def test_poignees():
    # Simple and double poignees
    party = FakePartyResult( points=49
                        , oudlers=1
                        , contract=ContractType.garde_sans
                        , poignee_simple_players_ids = [1]
                        , poignee_triple_players_ids = [4])
    scores = compute_party_result_scores(party)
    assert scores=={1: -336, 2: -168, 3: 168, 4: 168, 5: 168}

    # Two double poignees
    party = FakePartyResult( points=56
                    , oudlers=0
                    , contract=ContractType.petite
                    , taker_id=1
                    , called_player_id=1
                    , petit_au_bout_player_id=4
                    , petit_au_bout_won=False
                    , poignee_double_players_ids = [4,5])
    scores = compute_party_result_scores(party)
    assert scores=={1: 380, 2: -95, 3: -95, 4: -95, 5: -95}


def test_chlem():
    # Won
    party = FakePartyResult( points=53
                        , oudlers=1
                        , contract=ContractType.garde_sans
                        , chlem=ChlemType.announced_and_won)
    scores = compute_party_result_scores(party)
    assert scores=={1: 1016, 2: 508, 3: -508, 4: -508, 5: -508}

    # Announced and failed
    party = FakePartyResult( points=56
                        , oudlers=0
                        , taker_id=1
                        , called_player_id=1
                        , contract=ContractType.garde_contre
                        , chlem=ChlemType.announced_and_failed)
    scores = compute_party_result_scores(party)
    assert scores=={1: -200, 2: 50, 3: 50, 4: 50, 5: 50}

    # Non announced and won
    party = FakePartyResult( points=37
                        , oudlers=3
                        , contract=ContractType.garde
                        , chlem=ChlemType.non_announced_and_won)
    scores = compute_party_result_scores(party)
    assert scores=={1: 504, 2: 252, 3: -252, 4: -252, 5: -252}


def test_misere_tete():
    # Simple misere tête
    party = FakePartyResult( points=56
                        , oudlers=0
                        , contract=ContractType.garde
                        , misere_tete_players_ids=[4])
    scores = compute_party_result_scores(party)
    assert scores=={1: 90, 2: 40, 3: -60, 4: -10, 5: -60}

    # Double misere tête
    party = FakePartyResult( points=56
                        , oudlers=0
                        , contract=ContractType.garde_sans
                        , misere_tete_players_ids=[2,5])
    scores = compute_party_result_scores(party)
    assert scores=={1: 180, 2: 130, 3: -120, 4: -120, 5: -70}

def test_misere_atout():
    # Simple misere atout
    party = FakePartyResult( points=56
                        , oudlers=0
                        , contract=ContractType.garde
                        , misere_atout_players_ids=[4])
    scores = compute_party_result_scores(party)
    assert scores=={1: 90, 2: 40, 3: -60, 4: -10, 5: -60}

    # Double misere atout
    party = FakePartyResult( points=56
                        , oudlers=0
                        , contract=ContractType.garde_sans
                        , misere_atout_players_ids=[2,5])
    scores = compute_party_result_scores(party)
    assert scores=={1: 180, 2: 130, 3: -120, 4: -120, 5: -70}