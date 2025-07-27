import { useState } from 'react';
import HomePage from './components/HomePage';
import NewPartyForm from './components/NewPartyForm';
import TarotQuestionnaire from './components/TarotQuestionnaire';
import './App.css';

function App() {
  const [step, setStep] = useState('home');
  const [partyData, setPartyData] = useState(null);

  return (
    <div className="app-wrapper">
      <div className="container">
        {step === 'home' && <HomePage onStart={() => setStep('form')} />}
        {step === 'form' && (
          <NewPartyForm
            onNext={(data) => {
              setPartyData(data);
              setStep('questionnaire');
            }}
          />
        )}
        {step === 'questionnaire' && <TarotQuestionnaire players={partyData.players} />}
      </div>
    </div>
  );
}

export default App;
