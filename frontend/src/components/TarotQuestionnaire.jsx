import { useState } from 'react';
import './TarotQuestionnaire.css';

function TarotQuestionnaire({ players }) {
  const [taker, setTaker] = useState('');
  const [called, setCalled] = useState('');
  const [oudlers, setOudlers] = useState(0);
  const [points, setPoints] = useState(50);
  const [side, setSide] = useState('attack');
  const [petit, setPetit] = useState(false);
  const [poignees, setPoignees] = useState([]);
  const [chlem, setChlem] = useState(false);
  const [miseres, setMiseres] = useState({
    atout: [],
    tete: []
  });

  const togglePoignee = (value) => {
    setPoignees((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const toggleMisere = (type, player) => {
    setMiseres((prev) => {
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
      oudlers,
      points,
      side,
      petit,
      poignees,
      chlem,
      miseres
    };
    console.log(result);
    alert("Result submitted (check console)");
  };

  return (
    <div>
      <h2>Tarot Game Details</h2>

      <div className="section">
        <label>Taker:</label>
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
        <label>Called Player:</label>
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
        <label>Number of Oudlers:</label>
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
        Points:
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
        Side:
        <select value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="attack">Attack</option>
          <option value="defense">Defense</option>
        </select>
      </label>

      <label>
        Petit au bout:
        <input type="checkbox" checked={petit} onChange={(e) => setPetit(e.target.checked)} />
      </label>

      <fieldset>
        <legend>Poignées</legend>
        <div className="button-group no-wrap-buttons">
          {[10, 13, 15].map((n) => (
            <button
              key={n}
              className={poignees.includes(n) ? 'selected' : ''}
              onClick={() => togglePoignee(n)}
            >
              {n} cards
            </button>
          ))}
        </div>
      </fieldset>

      <label>
        Chlem:
        <input type="checkbox" checked={chlem} onChange={(e) => setChlem(e.target.checked)} />
      </label>

      <fieldset>
        <legend>Misères</legend>
        <div>
          <div className="label">Misères d’atout:</div>
          <div className="button-group no-wrap-buttons">
            {players.map((p, i) => (
              <button
                key={"atout" + i}
                className={miseres.atout.includes(p) ? 'selected' : ''}
                onClick={() => toggleMisere('atout', p)}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="label">Misères de tête:</div>
          <div className="button-group no-wrap-buttons">
            {players.map((p, i) => (
              <button
                key={"tete" + i}
                className={miseres.tete.includes(p) ? 'selected' : ''}
                onClick={() => toggleMisere('tete', p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <button onClick={handleSubmit}>Submit Game</button>
    </div>
  );
}

export default TarotQuestionnaire;
