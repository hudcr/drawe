import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// kept this as a component but ended up inlining sign-out in most pages anyway
// TODO: maybe just delete this
export default function Nav() {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={async () => {
          await logOut();
          navigate("/login");
        }}
        className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
}
