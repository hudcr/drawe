import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      navigate("/");
    } catch (err) {
      // firebase gives ugly error messages so we clean them up
      const msg = err.message?.includes("email-already-in-use")
        ? "That email is already taken."
        : "Failed to create account.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          DRAWE
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Create an account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <input
          type="text"
          placeholder="Username"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400"
        />
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
          placeholder="Password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400"
        />
        {error && <p className="text-pink-500 text-xs text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading || !displayName.trim()}
          className="py-3 font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer mt-1 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-cyan-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
