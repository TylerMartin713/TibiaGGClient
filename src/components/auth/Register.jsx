import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../footer/footer.jsx";

export const Register = () => {
  const [email, setEmail] = useState("admina@straytor.com");
  const [password, setPassword] = useState("straytor");
  const [firstName, setFirstName] = useState("Admina");
  const [lastName, setLastName] = useState("Straytor");
  const existDialog = useRef();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((authInfo) => {
        if (authInfo && authInfo.token) {
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
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Join the Adventure!
              </h2>
              <p className="text-gray-400">
                Create your account and start exploring Tibia
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(evt) => setFirstName(evt.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    placeholder="First name"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(evt) => setLastName(evt.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

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
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Create Account
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Already have an account? Sign in →
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
                Registration Failed
              </h3>
              <p className="text-gray-300 mb-6">
                Unable to create account. Please try again or contact support.
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
