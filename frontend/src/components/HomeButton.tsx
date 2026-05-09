import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import "./HomeButton.css";

export default function HomeButton() {
  return (
    <Link to="/" className="home-button" title="Go Home">
      <Home size={22} />
    </Link>
  );
}
