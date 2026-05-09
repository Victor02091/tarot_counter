import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageWrapper from "./pages/HomePageWrapper";
import NewPartyFormWrapper from "./pages/NewPartyFormWrapper";
import PartyFormWrapper from "./pages/PartyFormWrapper";
import ResumeSessions from "./pages/ResumeSessions";
import SessionDetails from "./pages/SessionDetails";
import HomeButton from "./components/HomeButton";

function App() {
  return (
    <Router>
      <div className="flex w-full items-start justify-center min-h-screen p-4 text-[#111]">
        <div className="w-full max-w-[500px] bg-bg-card p-6 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
          <h1 className="text-2xl font-bold mb-6 text-[#222]">
            🎴 Compteur de tarot
          </h1>

          <Routes>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/new-party" element={<NewPartyFormWrapper />} />
            <Route path="/session/:sessionId" element={<SessionDetails />} />
            <Route path="/party/:sessionId" element={<PartyFormWrapper />} />
            <Route path="/resume" element={<ResumeSessions />} />
          </Routes>
        </div>

        <HomeButton />
      </div>
    </Router>
  );
}

export default App;
