import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerHR } from "../api";

function RegisterHR() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
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

    // Clear error while user edits
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await registerHR({
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      console.log("HR registration successful:", response);

      // Registration completed successfully.
      // Send user to login page.
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
          email: form.email.trim().toLowerCase(),
        },
      });
    } catch (err) {
      console.error("HR registration failed:", err);

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
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0">
        {/* Top glow */}
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[150px]" />

        {/* Bottom glow */}
        <div className="absolute bottom-[-180px] left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.06] blur-[150px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#070b14_90%)]" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2"
          >
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-white/[0.06]">
              <div className="absolute h-5 w-5 rounded-full bg-blue-500/30 blur-md transition-all duration-500 group-hover:bg-blue-400/50" />

              <span className="relative text-[11px] font-bold text-white">
                H
              </span>
            </div>

            <span className="text-[20px] font-semibold tracking-[-0.045em] text-white">
              Hire<span className="text-slate-500">Flow</span>
            </span>
          </Link>

          {/* Sign in */}
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

      {/* =====================================================
          CENTERED FORM
      ===================================================== */}

      <div className="relative flex w-full justify-center px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
        <section className="relative w-full max-w-[560px]">
          {/* Card glow */}
          <div className="absolute -inset-5 rounded-[32px] bg-blue-500/[0.045] blur-3xl" />

          {/* =================================================
              CARD
          ================================================= */}

          <div className="relative rounded-[24px] border border-white/[0.09] bg-[#0c121e]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-[26px] sm:p-8">
            {/* =================================================
                HEADER
            ================================================= */}

            <div>
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                    HR workspace
                  </p>

                  <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[27px]">
                    Create your account
                  </h1>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Set up your hiring workspace and start managing
                    interviews.
                  </p>
                </div>

                {/* Account Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10 text-blue-400">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6M22 11h-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-white/[0.06] sm:my-7" />

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />

                    <path
                      strokeLinecap="round"
                      d="M12 8v4M12 16h.01"
                    />
                  </svg>

                  <p className="text-xs leading-5 text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* =================================================
                  TWO COLUMN INPUT GRID
              ================================================= */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <Field
                  id="name"
                  name="name"
                  label="Full name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                />

                {/* Company */}
                <Field
                  id="company"
                  name="company"
                  label="Company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  autoComplete="organization"
                />

                {/* Email */}
                <Field
                  id="email"
                  name="email"
                  label="Work email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                />

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-12 text-sm text-white outline-none placeholder:text-slate-700 transition-all duration-200 focus:border-blue-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-blue-500/[0.06]"
                    />

                    {/* Password toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.58 10.58a2 2 0 002.83 2.83" />
                          <path d="M9.88 4.24A9.77 9.77 0 0112 4c5 0 8.27 4.11 9 6a14.7 14.7 0 01-2.05 3.31" />
                          <path d="M6.61 6.61C4.62 8 3.33 10 3 10c.73 1.89 4 6 9 6 1.08 0 2.07-.18 2.95-.5" />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-700">
                    Use at least 8 characters.
                  </p>
                </div>
              </div>

              {/* =================================================
                  TERMS
              ================================================= */}

              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-500"
                />

                <span className="text-[11px] leading-5 text-slate-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-slate-400 underline decoration-slate-700 underline-offset-2 transition-colors hover:text-white"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-slate-400 underline decoration-slate-700 underline-offset-2 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className={`group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-slate-950 transition-all duration-300 ${
                  loading
                    ? "cursor-not-allowed opacity-60"
                    : "hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)] active:translate-y-0"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        className="opacity-25"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        d="M21 12a9 9 0 00-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>

                    Creating workspace...
                  </>
                ) : (
                  <>
                    Create workspace

                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.5 10a.75.75 0 01.75-.75h10.19l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06 1.06l3.22-3.22H4.25A.75.75 0 013.5 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-5 border-t border-white/[0.06] pt-5 text-center">
              <p className="text-xs text-slate-600">
                Already managing interviews?

                <Link
                  to="/login"
                  className="ml-1.5 font-medium text-slate-300 transition-colors hover:text-white"
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

/* =============================================================
   FIELD COMPONENT
============================================================= */

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
        className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-slate-700 transition-all duration-200 focus:border-blue-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-blue-500/[0.06]"
      />
    </div>
  );
}

export default RegisterHR;