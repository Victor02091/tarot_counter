import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageWrapper from "./pages/HomePageWrapper";
import NewPartyFormWrapper from "./pages/NewPartyFormWrapper";
import PartyFormWrapper from "./pages/PartyFormWrapper";
import ResumeSessions from "./pages/ResumeSessions";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper" style={{ color: "#111" }}>
        <div className="container">
          <h1 className="app-title" style={{ color: "#222" }}>
            🎴 Compteur de tarot
          </h1>

          <Routes>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/new-party" element={<NewPartyFormWrapper />} />
            <Route path="/party/:sessionId" element={<PartyFormWrapper />} />
            <Route path="/resume" element={<ResumeSessions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
