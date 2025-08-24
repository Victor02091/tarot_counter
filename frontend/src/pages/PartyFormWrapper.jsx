import { useParams, useLocation } from "react-router-dom";
import PartyForm from "../components/PartyForm";

export default function PartyFormWrapper() {
  const { sessionId } = useParams();
  const location = useLocation();
  const { players } = location.state || [];

  return <PartyForm players={players} sessionId={sessionId} />;
}
