import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

        {/* Main Footer */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
                rohit this side
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-950">
                Hire<span className="text-blue-600">Flow</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-500">
              A simpler way to schedule interviews, coordinate candidates,
              and keep your hiring process moving.
            </p>

            {/* Status */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-medium text-slate-600">
                All systems operational
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Product:v1
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/register/hr"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  For HR Teams
                </Link>
              </li>

              <li>
                <Link
                  to="/register/candidate"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  For Candidates
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Company:v1
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-slate-500 transition-colors hover:text-blue-600"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-slate-200" />

        {/* Bottom */}
        <div className="flex flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">

          <p className="text-slate-400">
            © 2026 HireFlow. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-slate-400 transition-colors hover:text-slate-900"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="text-slate-400 transition-colors hover:text-slate-900"
              aria-label="GitHub"
            >
              GitHub
            </a>

            <a
              href="#"
              className="text-slate-400 transition-colors hover:text-slate-900"
              aria-label="X"
            >
              X
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
