import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../footer/footer.jsx";

export const Login = () => {
  const [email, setEmail] = useState("tyler@yur.com");
  const [password, setPassword] = useState("yurr");
  const existDialog = useRef();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((authInfo) => {
        if (authInfo.valid) {
          localStorage.setItem("TibiaGG_token", JSON.stringify(authInfo));
          navigate("/");
        } else {
          existDialog.current.showModal();
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="text-center">
              <h1 className="text-5xl font-bold text-amber-400 mb-2">
                TibiaGG
              </h1>
              <div className="text-6xl mb-4">🐉</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome Back, Adventurer!
              </h2>
              <p className="text-gray-400">
                Sign in to your account to continue your journey
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="inputEmail"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="inputEmail"
                  value={email}
                  onChange={(evt) => setEmail(evt.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="inputPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="inputPassword"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Sign In
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/register"
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  New to TibiaGG? Create an account →
                </Link>
              </div>
            </form>
          </div>

          {/* Error Dialog */}
          <dialog
            className="bg-gray-800 text-white rounded-lg border border-red-500 p-6 backdrop:bg-black backdrop:bg-opacity-50"
            ref={existDialog}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-400 mb-2">
                Authentication Failed
              </h3>
              <p className="text-gray-300 mb-6">
                Invalid email or password. Please try again.
              </p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                onClick={() => existDialog.current.close()}
              >
                Try Again
              </button>
            </div>
          </dialog>
        </div>
      </div>
      <Footer />
    </div>
  );
};
