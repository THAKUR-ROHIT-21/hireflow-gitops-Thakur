import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { checkAPI } from "../api";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);

  const location = useLocation();

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Backend + PostgreSQL health check
  useEffect(() => {
    let mounted = true;

    const checkBackendHealth = async () => {
      try {
        const data = await checkAPI();

        if (mounted) {
          setBackendHealthy(
            data?.status === "ok" &&
              data?.database === "connected"
          );
        }
      } catch {
        if (mounted) {
          setBackendHealthy(false);
        }
      }
    };

    // Initial check
    checkBackendHealth();

    // Check every 30 seconds
    const interval = setInterval(
      checkBackendHealth,
      30000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.07] bg-[#070b14]/85 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12"
        aria-label="Main navigation"
      >
        {/* =====================================================
            BRAND
        ===================================================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2"
        >
          {/* Minimal mark */}
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

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="hidden items-center lg:flex">
          <div className="flex items-center rounded-full border border-white/[0.07] bg-white/[0.025] p-1 backdrop-blur-xl">
            <Link
              to="/"
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                location.pathname === "/"
                  ? "bg-white/[0.07] text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              Product
            </Link>

            <Link
              to="/register/hr"
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                location.pathname === "/register/hr"
                  ? "bg-white/[0.07] text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              For teams
            </Link>

            <Link
              to="/register/candidate"
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                location.pathname === "/register/candidate"
                  ? "bg-white/[0.07] text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              Candidates
            </Link>
          </div>
        </div>

        {/* =====================================================
            DESKTOP ACTIONS
        ===================================================== */}

        <div className="hidden items-center gap-4 lg:flex">

          {/* Backend Health LED */}

          <div
            className="group flex items-center gap-2 px-2"
            title={
              backendHealthy
                ? "Backend and PostgreSQL are healthy"
                : "Backend or PostgreSQL is unavailable"
            }
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span
                className={`absolute h-2 w-2 rounded-full ${
                  backendHealthy
                    ? "bg-emerald-400"
                    : "bg-red-500"
                }`}
              />

              {backendHealthy && (
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-50" />
              )}
            </span>

            <span
              className={`text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                backendHealthy
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {backendHealthy ? "Healthy" : "Unhealthy"}
            </span>
          </div>

          <Link
            to="/login"
            className="px-3 py-2 text-[13px] font-medium text-slate-400 transition-colors duration-300 hover:text-white"
          >
            Sign in
          </Link>

          <Link
            to="/register/hr"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-[0_0_30px_rgba(59,130,246,0.18)]"
          >
            <span className="relative z-10">
              Get started
            </span>

            <svg
              className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.5 10a.75.75 0 01.75-.75h10.19l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H4.25A.75.75 0 013.5 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* =====================================================
            MOBILE BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.08] hover:text-white lg:hidden"
          aria-label={
            mobileOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* =======================================================
          MOBILE MENU
      ======================================================= */}

      <div
        className={`overflow-hidden border-t border-white/[0.06] bg-[#070b14]/95 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-[600px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-5 py-5 sm:px-8">

          {/* Mobile navigation */}

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2">

            <Link
              to="/"
              onClick={closeMenu}
              className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-white/[0.06] text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              Product

              <span className="text-xs text-slate-600">
                01
              </span>
            </Link>

            <Link
              to="/register/hr"
              onClick={closeMenu}
              className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                location.pathname === "/register/hr"
                  ? "bg-white/[0.06] text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              For teams

              <span className="text-xs text-slate-600">
                02
              </span>
            </Link>

            <Link
              to="/register/candidate"
              onClick={closeMenu}
              className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                location.pathname === "/register/candidate"
                  ? "bg-white/[0.06] text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              Candidates

              <span className="text-xs text-slate-600">
                03
              </span>
            </Link>
          </div>

          {/* Mobile health status */}

          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span
                className={`absolute h-2 w-2 rounded-full ${
                  backendHealthy
                    ? "bg-emerald-400"
                    : "bg-red-500"
                }`}
              />

              {backendHealthy && (
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-50" />
              )}
            </span>

            <span
              className={`text-[11px] font-medium uppercase tracking-[0.12em] ${
                backendHealthy
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {backendHealthy
                ? "System healthy"
                : "System unavailable"}
            </span>
          </div>

          {/* Mobile actions */}

          <div className="mt-3 grid grid-cols-2 gap-2">

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-center text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Sign in
            </Link>

            <Link
              to="/register/hr"
              onClick={closeMenu}
              className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-blue-50"
            >
              Get started
            </Link>
          </div>

          {/* Mobile footer detail */}

          <div className="flex items-center justify-center gap-2 py-5 text-[10px] uppercase tracking-[0.18em] text-slate-700">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                backendHealthy
                  ? "bg-emerald-400"
                  : "bg-red-500"
              }`}
            />

            Interview infrastructure
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
