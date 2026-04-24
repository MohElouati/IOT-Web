import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      localStorage.setItem("token", "123");

      window.location.href = "/app"; // 🔥 IMPORTANT
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Micro Factory
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-3 rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
}