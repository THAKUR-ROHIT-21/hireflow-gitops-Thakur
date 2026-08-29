import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, saveAuth } from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(
        form.email,
        form.password
      );

      // Store JWT + user information
      saveAuth(data);

      // Redirect according to role
      const role = data?.user?.role;

      if (role === "hr") {
        navigate("/dashboard/hr", { replace: true });
        return;
      }

      if (role === "candidate") {
        navigate("/dashboard/candidate", { replace: true });
        return;
      }

      // Fallback
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err.message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b14] px-5 py-24 text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-[520px] items-center justify-center">

        <div className="w-full">

          {/* Back */}
          <div className="mb-8">
            <Link
              to="/"
              className="text-sm text-slate-500 transition-colors hover:text-white"
            >
              ← Back to website
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-9">

            {/* Icon */}
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 17l5-5-5-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H3"
                />
              </svg>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                Welcome back
              </p>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Sign in to HireFlow
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Continue managing your interviews and hiring workflow.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="h-14 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-400"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="h-14 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-500">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-white/[0.05] accent-blue-500"
                />

                Keep me signed in
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-white text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 h-px bg-white/[0.07]" />

            {/* Register */}
            <div className="text-center text-sm text-slate-600">
              Don't have an account?{" "}

              <Link
                to="/register/hr"
                className="font-medium text-slate-300 transition-colors hover:text-white"
              >
                Create an account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.16em] text-slate-700">
            Secure access · HireFlow
          </p>

        </div>
      </div>
    </main>
  );
}

export default Login;