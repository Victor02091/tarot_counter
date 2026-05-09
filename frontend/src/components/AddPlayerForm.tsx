import React, { useState } from "react";
import { addPlayerApiPlayersPost, type PlayerRead } from "../api";

interface AddPlayerFormProps {
  onCancel: () => void;
  onSubmit: (player: PlayerRead) => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onCancel, onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName) return;

    setLoading(true);

    try {
      const { data, error } = await addPlayerApiPlayersPost({
        body: {
          first_name: firstName,
          last_name: lastName,
        },
      });

      if (error) throw error;
      if (!data) throw new Error("No data returned");

      alert("Joueur ajouté avec succès !");
      onSubmit(data);
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
    <div className="mt-4 p-4 border border-border-subtle rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau joueur</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Prénom:</label>
          <input
            type="text"
            className="w-full p-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Nom:</label>
          <input
            type="text"
            className="w-full p-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isDisabled}
            className={`flex-1 p-3 rounded-lg font-semibold transition-colors ${
              isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-brand-primary text-white hover:bg-brand-primary-hover"
            }`}
          >
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
          <button
            type="button"
            className="flex-1 p-3 border border-border-subtle rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayerForm;
