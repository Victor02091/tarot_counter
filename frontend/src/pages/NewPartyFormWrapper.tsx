import { useNavigate } from "react-router-dom";
import NewPartyForm from "../components/NewPartyForm";

export default function NewPartyFormWrapper() {
  const navigate = useNavigate();

  return (
    <NewPartyForm
      onNext={(data) =>
        navigate(`/party/${data.sessionId}`, { state: { players: data.players } })
      }
    />
  );
}
