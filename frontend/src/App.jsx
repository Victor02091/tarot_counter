import { useState } from "react";
import HomePage from "./components/HomePage";
import NewPartyForm from "./components/NewPartyForm";
import PartyForm from "./components/PartyForm";
import "./App.css";

function App() {
  const [step, setStep] = useState("home");
  const [partyData, setPartyData] = useState(null);

  return (
    <div className="app-wrapper" style={{ color: "#111" }}>
      <div className="container">
        <h1 className="app-title" style={{ color: "#222" }}>
          🎴 Compteur de tarot
        </h1>
        {step === "home" && <HomePage onStart={() => setStep("form")} />}
        {step === "form" && (
          <NewPartyForm
            onNext={(data) => {
              setPartyData(data);
              setStep("questionnaire");
            }}
          />
        )}
        {step === "questionnaire" && (
          <PartyForm
            players={partyData.players}       // Array of {id, displayName}
            sessionId={partyData.sessionId}   // Session ID for backend
          />
        )}
      </div>
    </div>
  );
}

export default App;
