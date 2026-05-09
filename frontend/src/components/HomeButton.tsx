import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <Link
      to="/"
      className="fixed bottom-6 right-6 bg-brand-primary text-white rounded-full p-3 flex items-center justify-center shadow-lg transition-all hover:bg-brand-primary-hover hover:scale-105"
      title="Go Home"
    >
      <Home size={22} />
    </Link>
  );
}
