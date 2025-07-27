import { useState } from 'react';

function NewPartyForm({ onNext }) {
  const [partyName, setPartyName] = useState('');
  const [players, setPlayers] = useState(Array(5).fill(''));

  const handleChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  return (
    <div>
      <h2>Start a New Party</h2>
      <label>
        Party Name:
        <input value={partyName} onChange={(e) => setPartyName(e.target.value)} />
      </label>
      <h3>Players:</h3>
      {players.map((name, i) => (
        <div key={i}>
          <input
            placeholder={`Player ${i + 1}`}
            value={name}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
      <button onClick={() => onNext({ partyName, players })}>Continue</button>
    </div>
  );
}

export default NewPartyForm;
