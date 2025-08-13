import { useState } from "react";

function AddPlayerForm({ onCancel, onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      alert("Veuillez remplir le prénom et le nom.");
      return;
    }

    // Return the new player
    onSubmit({ firstName, lastName });

    // Reset form
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="add-player-form">
      <h3>Ajouter un nouveau joueur</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Prénom:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Nom:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Ajouter</button>
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPlayerForm;
