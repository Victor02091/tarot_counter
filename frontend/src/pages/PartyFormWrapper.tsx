import { useParams, useLocation } from "react-router-dom";
import PartyForm from "../components/PartyForm";

export default function PartyFormWrapper() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const { players } = (location.state as { players: { id: number; displayName: string }[] }) || { players: [] };

  return <PartyForm players={players} sessionId={sessionId!} />;
}
