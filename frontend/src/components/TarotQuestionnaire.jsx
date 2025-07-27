import { useState } from 'react';
import './TarotQuestionnaire.css';

function TarotQuestionnaire({ players }) {
  const [taker, setTaker] = useState('');
  const [called, setCalled] = useState('');
  const [contract, setContract] = useState('');
  const [oudlers, setOudlers] = useState(0);
  const [points, setPoints] = useState(50);
  const [side, setSide] = useState('attack');
  const [petit, setPetit] = useState(false);
  const [poignees, setPoignees] = useState({ simple: [], double: [], triple: [] });
  const [chlem, setChlem] = useState(false);
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

  const handleSubmit = () => {
    const result = {
      taker,
      called,
      contract,
      oudlers,
      points,
      side,
      petit,
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

      <label>
        Petit au bout :
        <input type="checkbox" checked={petit} onChange={(e) => setPetit(e.target.checked)} />
      </label>

      <fieldset>
        <legend>Poignées</legend>
        <label>Simple (8 atouts):</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`simple-${i}`}
              className={poignees.simple.includes(p) ? 'selected' : ''}
              onClick={() => togglePoignee('simple', p)}
            >
              {p}
            </button>
          ))}
        </div>
        <label>Double (10 atouts):</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`double-${i}`}
              className={poignees.double.includes(p) ? 'selected' : ''}
              onClick={() => togglePoignee('double', p)}
            >
              {p}
            </button>
          ))}
        </div>
        <label>Triple (13 atouts):</label>
        <div className="button-group no-wrap-buttons">
          {players.map((p, i) => (
            <button
              key={`triple-${i}`}
              className={poignees.triple.includes(p) ? 'selected' : ''}
              onClick={() => togglePoignee('triple', p)}
            >
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <label>
        Chelem :
        <input type="checkbox" checked={chlem} onChange={(e) => setChlem(e.target.checked)} />
      </label>

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
