import { useState } from 'react';

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
    atout: false,
    tete: false
  });

  const togglePoignee = (value) => {
    setPoignees((prev) =>
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    );
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

      <label>
        Taker:
        <select value={taker} onChange={(e) => setTaker(e.target.value)}>
          <option value="">--</option>
          {players.map((p, i) => <option key={i} value={p}>{p}</option>)}
        </select>
      </label>

      <label>
        Called Player:
        <select value={called} onChange={(e) => setCalled(e.target.value)}>
          <option value="">--</option>
          {players.map((p, i) => <option key={i} value={p}>{p}</option>)}
        </select>
      </label>

      <label>
        Number of Oudlers:
        <select value={oudlers} onChange={(e) => setOudlers(Number(e.target.value))}>
          {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

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
        {[10, 13, 15].map(n => (
          <label key={n}>
            <input
              type="checkbox"
              checked={poignees.includes(n)}
              onChange={() => togglePoignee(n)}
            />
            {n} cards
          </label>
        ))}
      </fieldset>

      <label>
        Chlem:
        <input type="checkbox" checked={chlem} onChange={(e) => setChlem(e.target.checked)} />
      </label>

      <fieldset>
        <legend>Misères</legend>
        <label>
          Misère d’atout:
          <input
            type="checkbox"
            checked={miseres.atout}
            onChange={(e) => setMiseres({ ...miseres, atout: e.target.checked })}
          />
        </label>
        <label>
          Misère de tête:
          <input
            type="checkbox"
            checked={miseres.tete}
            onChange={(e) => setMiseres({ ...miseres, tete: e.target.checked })}
          />
        </label>
      </fieldset>

      <button onClick={handleSubmit}>Submit Game</button>
    </div>
  );
}

export default TarotQuestionnaire;
