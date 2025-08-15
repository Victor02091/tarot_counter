import { useState } from "react";
import { addPlayer } from "../services/api";
import "./AddPlayerForm.css"; // make sure you have this

function AddPlayerForm({ onCancel, onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) return; // button is disabled anyway

    const newPlayer = { first_name: firstName, last_name: lastName };
    setLoading(true);

    try {
      const savedPlayer = await addPlayer(newPlayer);
      alert("Joueur ajouté avec succès !");
      onSubmit(savedPlayer);
      setFirstName("");
      setLastName("");
    } catch (err) {
      console.error("Erreur lors de l'ajout du joueur :", err);
      alert("Erreur lors de l'ajout du joueur");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !firstName || !lastName;

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
            disabled={loading}
          />
        </div>
        <div>
          <label>Nom:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-buttons">
          <button
            type="submit"
            disabled={isDisabled}
            className={isDisabled ? "disabled-button" : "active-button"}
          >
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
          <button type="button" onClick={onCancel} disabled={loading}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPlayerForm;
