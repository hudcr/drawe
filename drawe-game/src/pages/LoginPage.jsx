import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          DRAWE
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Sign in to play</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400"
        />
        {error && <p className="text-pink-500 text-xs text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 py-3 font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Log In"}
        </button>
      </form>

      <p className="text-gray-400 text-sm">
        No account?{" "}
        <Link to="/signup" className="text-cyan-500 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
