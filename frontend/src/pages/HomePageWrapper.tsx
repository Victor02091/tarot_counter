import { useNavigate } from "react-router-dom";
import HomePage from "../components/HomePage";

export default function HomePageWrapper() {
  const navigate = useNavigate();
  return <HomePage onStart={() => navigate("/new-party")} />;
}
