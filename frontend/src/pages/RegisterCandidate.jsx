import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCandidate } from "../api";

function RegisterCandidate() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
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

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.role) {
      setError("Please select the role you're interested in.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await registerCandidate(form);

      console.log("Candidate registration successful:", response);

      /*
       * Registration is complete.
       *
       * Do not automatically log the candidate into the dashboard
       * unless your backend returns a JWT during registration.
       *
       * Send the candidate to login so the authentication flow
       * remains explicit.
       */
      navigate("/login", {
        replace: true,
        state: {
          email: form.email,
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      console.error("Candidate registration failed:", err);

      setError(
        err?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#070b14] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[150px]" />

        <div className="absolute bottom-[-180px] left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.06] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#070b14_90%)]" />
      </div>

      {/* Header */}
      <header className="relative">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" className="group flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-white/[0.06]">
              <div className="absolute h-5 w-5 rounded-full bg-cyan-400/20 blur-md transition-all duration-500 group-hover:bg-cyan-400/40" />

              <span className="relative text-[11px] font-bold text-white">
                H
              </span>
            </div>

            <span className="text-[20px] font-semibold tracking-[-0.045em] text-white">
              Hire<span className="text-slate-500">Flow</span>
            </span>
          </Link>

          <Link
            to="/login"
            className="text-xs text-slate-500 transition-colors hover:text-white sm:text-sm"
          >
            <span className="hidden sm:inline">
              Already have an account?
            </span>

            <span className="font-medium text-white sm:ml-2">
              Sign in
            </span>
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="relative flex w-full justify-center px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
        <section className="relative w-full max-w-[560px]">
          <div className="absolute -inset-5 rounded-[32px] bg-cyan-500/[0.045] blur-3xl" />

          <div className="relative rounded-[24px] border border-white/[0.09] bg-[#0c121e]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-[26px] sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                  Candidate profile
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[27px]">
                  Create your account
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create your profile and keep your interview journey
                  organized.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-cyan-300">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0116 0" />
                </svg>
              </div>
            </div>

            <div className="my-6 h-px bg-white/[0.06] sm:my-7" />

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Inputs */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  id="candidate-name"
                  name="name"
                  label="Full name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                />

                <Field
                  id="candidate-email"
                  name="email"
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                {/* Role */}
                <div>
                  <label
                    htmlFor="candidate-role"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Role you're interested in
                  </label>

                  <div className="relative">
                    <select
                      id="candidate-role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      className="h-12 w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-10 text-sm text-white outline-none transition-all duration-200 focus:border-cyan-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-cyan-500/[0.05]"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#0c121e]"
                      >
                        Select a role
                      </option>

                      <option
                        value="software-engineer"
                        className="bg-[#0c121e]"
                      >
                        Software Engineer
                      </option>

                      <option
                        value="frontend-developer"
                        className="bg-[#0c121e]"
                      >
                        Frontend Developer
                      </option>

                      <option
                        value="backend-developer"
                        className="bg-[#0c121e]"
                      >
                        Backend Developer
                      </option>

                      <option
                        value="devops-engineer"
                        className="bg-[#0c121e]"
                      >
                        DevOps Engineer
                      </option>

                      <option
                        value="product-designer"
                        className="bg-[#0c121e]"
                      >
                        Product Designer
                      </option>

                      <option
                        value="product-manager"
                        className="bg-[#0c121e]"
                      >
                        Product Manager
                      </option>

                      <option
                        value="data-scientist"
                        className="bg-[#0c121e]"
                      >
                        Data Scientist
                      </option>

                      <option
                        value="other"
                        className="bg-[#0c121e]"
                      >
                        Other
                      </option>
                    </select>

                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="candidate-password"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="candidate-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-12 text-sm text-white outline-none placeholder:text-slate-700 transition-all duration-200 focus:border-cyan-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-cyan-500/[0.05]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "◉" : "◌"}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-700">
                    Use at least 8 characters.
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-400/10 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-400"
                />

                <span className="text-[11px] leading-5 text-slate-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-slate-400 underline decoration-slate-700 underline-offset-2 hover:text-white"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-slate-400 underline decoration-slate-700 underline-offset-2 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-[0_0_35px_rgba(34,211,238,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create candidate profile

                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.5 10a.75.75 0 01.75-.75h10.19l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-3.22 3.22H4.25A.75.75 0 013.5 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-white/[0.06] pt-5 text-center">
              <p className="text-xs text-slate-600">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-1.5 font-medium text-slate-300 hover:text-white"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  id,
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium text-slate-400"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-slate-700 transition-all duration-200 focus:border-cyan-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-cyan-500/[0.05]"
      />
    </div>
  );
}

export default RegisterCandidate;