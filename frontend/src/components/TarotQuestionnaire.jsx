import { useState } from 'react';
import './TarotQuestionnaire.css';

function TarotQuestionnaire({ players }) {
  const [taker, setTaker] = useState('');
  const [called, setCalled] = useState('');
  const [contract, setContract] = useState('');
  const [oudlers, setOudlers] = useState(0);
  const [points, setPoints] = useState(50);
  const [side, setSide] = useState('attack');
  const [petitPlayer, setPetitPlayer] = useState('');
  const [petitResult, setPetitResult] = useState('');
  const [poignees, setPoignees] = useState({ simple: [], double: [], triple: [] });
  const [chlem, setChlem] = useState('');
  const [miseres, setMiseres] = useState({ atout: [], tete: [] });

  const toggleMisere = (type, player) => {
    setMiseres((prev) => {
      const updated = prev[type].includes(player)
        ? prev[type].filter((p) => p !== player)
        : [...prev[type], player];
      return { ...prev, [type]: updated };
    });
  };

  const togglePoignee = (type, player) => {
    setPoignees((prev) => {
      const updated = prev[type].includes(player)
        ? prev[type].filter((p) => p !== player)
        : [...prev[type], player];
      return { ...prev, [type]: updated };
    });
  };

  const togglePetit = (player) => {
    if (petitPlayer !== player) {
      setPetitPlayer(player);
      setPetitResult('gagne');
    } else {
      setPetitResult(petitResult === 'gagne' ? 'perdu' : '');
      if (petitResult === '') setPetitPlayer('');
    }
  };

  const handleSubmit = () => {
    const result = {
      taker,
      called,
      contract,
      oudlers,
      points,
      side,
      petit: { player: petitPlayer, result: petitResult },
      poignees,
      chlem,
      miseres
    };
    console.log(result);
    alert("Résultat soumis (voir console)");
  };

  return (
    <div>
      <h2>Détails de la partie de Tarot</h2>

      <div className="section">
        <label>Preneur :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={i}
              className={taker === p ? 'selected' : ''}
              onClick={() => setTaker(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Joueur appelé :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={i}
              className={called === p ? 'selected' : ''}
              onClick={() => setCalled(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Contrat :</label>
        <div className="button-group no-wrap-buttons">
          {["Petite", "Garde", "Garde sans", "Garde contre"].map((c, i) => (
            <button
              key={i}
              className={contract === c ? 'selected' : ''}
              onClick={() => setContract(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label>Nombre d'oudlers :</label>
        <div className="button-group no-wrap-buttons">
          {[0, 1, 2, 3].map((n) => (
            <button
              key={n}
              className={oudlers === n ? 'selected' : ''}
              onClick={() => setOudlers(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <label>
        Points :
        <input
          type="range"
          min="0"
          max="91"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
        />
        {points}
      </label>

      <label>
        Camp :
        <select value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="attack">Attaque</option>
          <option value="defense">Défense</option>
        </select>
      </label>

      <fieldset>
        <legend>Petit au bout</legend>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`petit-${i}`}
              className={petitPlayer === p ? (petitResult === 'gagne' ? 'success' : petitResult === 'perdu' ? 'danger' : 'selected') : ''}
              onClick={() => togglePetit(p)}
            >
              {p}<br />
              {petitPlayer === p && petitResult === 'gagne' && <span style={{ color: 'green' }}>Gagné</span>}
              {petitPlayer === p && petitResult === 'perdu' && <span style={{ color: 'red' }}>Perdu</span>}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Poignées</legend>
        {['simple', 'double', 'triple'].map((type, idx) => (
          <div key={type}>
            <label>
              {type === 'simple' ? 'Simple (8 atouts)' : type === 'double' ? 'Double (10 atouts)' : 'Triple (13 atouts)'}
            </label>
            <div className="button-group no-wrap-buttons">
              {players.map((p, i) => (
                <button
                  key={`${type}-${i}`}
                  className={poignees[type].includes(p) ? 'selected' : ''}
                  onClick={() => togglePoignee(type, p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset>
        <legend>Chelem</legend>
        <div className="button-group no-wrap-buttons">
          {["Annoncé et passé", "Non annoncé et passé", "Annoncé et chuté"].map((option, i) => (
            <button
              key={i}
              className={chlem === option ? 'selected' : ''}
              onClick={() => setChlem(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Misères</legend>
        <label>Misère d’atout :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`atout-${i}`}
              className={miseres.atout.includes(p) ? 'selected' : ''}
              onClick={() => toggleMisere('atout', p)}
            >
              {p}
            </button>
          ))}
        </div>
        <label>Misère de tête :</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`tete-${i}`}
              className={miseres.tete.includes(p) ? 'selected' : ''}
              onClick={() => toggleMisere('tete', p)}
            >
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <button onClick={handleSubmit}>Valider la partie</button>
    </div>
  );
}

export default TarotQuestionnaire;
