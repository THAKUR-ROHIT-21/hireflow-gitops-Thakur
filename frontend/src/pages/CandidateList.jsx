import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  getHRDashboard,
  getStoredUser,
  logout,
} from "../api";

function CandidateList() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const user = useMemo(() => getStoredUser(), []);

  /*
  |--------------------------------------------------------------------------
  | LOAD CANDIDATES
  |--------------------------------------------------------------------------
  */

  const loadCandidates = useCallback(
    async ({ silent = false } = {}) => {
      console.group("========== CANDIDATE LIST DEBUG ==========");

      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        /*
        |--------------------------------------------------------------------------
        | AUTH CHECK
        |--------------------------------------------------------------------------
        */

        const token = localStorage.getItem("hireflow_token");
        const storedUser = getStoredUser();

        console.log("[CANDIDATES] Token exists:", Boolean(token));
        console.log("[CANDIDATES] Token length:", token?.length || 0);
        console.log("[CANDIDATES] Stored user:", storedUser);

        if (!token) {
          console.error("[CANDIDATES] ❌ No auth token");
        }

        /*
        |--------------------------------------------------------------------------
        | API REQUEST
        |--------------------------------------------------------------------------
        */

        console.log(
          "[CANDIDATES] Calling getHRDashboard()..."
        );

        const startedAt = performance.now();

        const response = await getHRDashboard();

        const requestTime = Math.round(
          performance.now() - startedAt
        );

        console.log(
          "[CANDIDATES] ✅ API SUCCESS"
        );

        console.log(
          "[CANDIDATES] Request time:",
          `${requestTime}ms`
        );

        console.log(
          "[CANDIDATES] Raw response:",
          response
        );

        console.log(
          "[CANDIDATES] Response JSON:",
          JSON.stringify(response, null, 2)
        );

        /*
        |--------------------------------------------------------------------------
        | EXTRACT CANDIDATES
        |--------------------------------------------------------------------------
        */

        const rawCandidates = Array.isArray(
          response?.candidates
        )
          ? response.candidates
          : Array.isArray(response?.recentCandidates)
          ? response.recentCandidates
          : [];

        console.log(
          "[CANDIDATES] Raw candidate array:",
          rawCandidates
        );

        console.log(
          "[CANDIDATES] Candidate count:",
          rawCandidates.length
        );

        /*
        |--------------------------------------------------------------------------
        | NORMALIZE DATA
        |--------------------------------------------------------------------------
        */

        const normalizedCandidates = rawCandidates
          .map(normalizeCandidate)
          .filter(Boolean);

        console.log(
          "[CANDIDATES] Normalized candidates:",
          normalizedCandidates
        );

        /*
        |--------------------------------------------------------------------------
        | FINAL STATE
        |--------------------------------------------------------------------------
        */

        setCandidates(normalizedCandidates);

        console.log(
          "[CANDIDATES] ✅ React state updated"
        );
      } catch (err) {
        console.error(
          "[CANDIDATES] ❌ API FAILED"
        );

        console.error(
          "[CANDIDATES] Error:",
          err
        );

        console.error(
          "[CANDIDATES] Message:",
          err?.message
        );

        setError(
          err?.message ||
            "Unable to load candidates."
        );
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }

        console.log(
          "[CANDIDATES] Loading finished"
        );

        console.groupEnd();
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredCandidates = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      return [
        candidate.name,
        candidate.email,
        candidate.role,
        candidate.stage,
        candidate.location,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [candidates, search]);

  /*
  |--------------------------------------------------------------------------
  | USER
  |--------------------------------------------------------------------------
  */

  const userName =
    user?.fullName ||
    user?.name ||
    "HR Administrator";

  const userInitials = getInitials(userName);

  const workspaceName =
    user?.company ||
    "Hiring workspace";

  const workspaceInitials =
    getInitials(workspaceName);

  /*
  |--------------------------------------------------------------------------
  | ACTIONS
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    logout();

    window.location.replace("/login");
  };

  const handleRetry = () => {
    loadCandidates();
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/[0.07] bg-[#090e18] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* BRAND */}

        <div className="flex h-[72px] items-center border-b border-white/[0.06] px-6">

          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2"
          >

            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border border-white/10 bg-white/[0.06]">

              <div className="absolute h-5 w-5 rounded-full bg-blue-500/30 blur-md" />

              <span className="relative text-[11px] font-bold">
                H
              </span>

            </div>

            <span className="text-[20px] font-semibold tracking-[-0.045em]">
              Hire
              <span className="text-slate-500">
                Flow
              </span>
            </span>

          </Link>

        </div>

        {/* WORKSPACE */}

        <div className="px-4 pt-5">

          <div className="flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-semibold text-blue-400">
              {workspaceInitials}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-medium text-white">
                {workspaceName}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-600">
                Hiring workspace
              </p>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="mt-7 flex-1 px-4">

          <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Workspace
          </p>

          <SidebarItem
            label="Overview"
            icon={<DashboardIcon />}
            onClick={() => navigate("/dashboard/hr")}
          />

          <SidebarItem
            active
            label="Candidates"
            badge={candidates.length}
            icon={<UsersIcon />}
          />

          <SidebarItem
            label="Interviews"
            icon={<CalendarIcon />}
          />

          <SidebarItem
            label="Job openings"
            icon={<BriefcaseIcon />}
          />

          <p className="mb-3 mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Manage
          </p>

          <SidebarItem
            label="Interviewers"
            icon={<TeamIcon />}
          />

          <SidebarItem
            label="Analytics"
            icon={<ChartIcon />}
          />

          <SidebarItem
            label="Settings"
            icon={<SettingsIcon />}
          />

        </nav>

        {/* USER */}

        <div className="border-t border-white/[0.06] p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/[0.035]"
          >

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-semibold text-white">
              {userInitials}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-medium text-slate-200">
                {userName}
              </p>

              <p className="truncate text-[10px] text-slate-600">
                HR Administrator
              </p>

            </div>

            <span className="text-[10px] text-slate-600">
              Sign out
            </span>

          </button>

        </div>

      </aside>

      {/* =========================================================
          MAIN
      ========================================================== */}

      <div className="lg:pl-[250px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#070b14]/90 px-5 backdrop-blur-xl sm:px-7 lg:px-9">

          <div className="flex min-w-0 items-center gap-4">

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] text-slate-400 lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon />
            </button>

            <div>

              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                Hiring workspace
              </p>

              <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.025em] text-white sm:text-xl">
                Candidates
              </h1>

            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            <div className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 text-xs text-slate-600 sm:flex">
              <SearchIcon />
              Search
            </div>

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-slate-500"
              aria-label="Notifications"
            >
              <BellIcon />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-[10px] font-semibold">
              {userInitials}
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-10">

          {/* HEADER */}

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-400/[0.05] px-3 py-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />

                <span className="text-[10px] font-medium text-blue-300">
                  Talent pool
                </span>

              </div>

              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                Candidates
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Review candidates and track their hiring progress.
              </p>

            </div>

            <Link
              to="/dashboard/hr"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white"
            >
              ← Back to overview
            </Link>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-medium text-red-300">
                  Candidate data unavailable
                </p>

                <p className="mt-1 text-[10px] text-red-300/60">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={handleRetry}
                disabled={loading}
                className="w-fit rounded-lg border border-red-400/10 px-3 py-1.5 text-[10px] text-red-300 transition-colors hover:bg-red-400/[0.05] disabled:opacity-50"
              >
                Retry
              </button>

            </div>
          )}

          {/* SEARCH / SUMMARY */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs text-slate-500">
                {loading
                  ? "Loading candidates..."
                  : `${filteredCandidates.length} candidate${
                      filteredCandidates.length === 1
                        ? ""
                        : "s"
                    }`}
              </p>

            </div>

            <div className="relative w-full sm:w-[300px]">

              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-600">
                <SearchIcon />
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search candidates..."
                className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#0c121e]/80 pl-9 pr-4 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-400/30"
              />

            </div>

          </div>

          {/* CANDIDATE LIST */}

          <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c121e]/80">

            {/* TABLE HEADER */}

            <div className="hidden border-b border-white/[0.06] px-5 py-3 md:grid md:grid-cols-[minmax(250px,1.5fr)_minmax(180px,1fr)_150px_120px] md:gap-5">

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                Candidate
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                Role
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                Stage
              </span>

              <span className="text-right text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                Score
              </span>

            </div>

            {/* CONTENT */}

            {loading ? (
              <CandidateLoadingRows count={5} />
            ) : filteredCandidates.length > 0 ? (
              <div className="divide-y divide-white/[0.05]">

                {filteredCandidates.map(
                  (candidate, index) => (
                    <CandidateListRow
                      key={
                        candidate.id ||
                        candidate.email ||
                        `candidate-${index}`
                      }
                      {...candidate}
                    />
                  )
                )}

              </div>
            ) : (
              <EmptyCandidateState
                search={search}
              />
            )}

          </section>

        </main>

      </div>

      {/* REFRESH */}

      {refreshing && (
        <div className="fixed bottom-5 right-5 z-50 rounded-full border border-white/[0.08] bg-[#0c121e]/95 px-3 py-2 text-[10px] text-slate-500 shadow-2xl backdrop-blur-xl">
          Updating candidates...
        </div>
      )}

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| NORMALIZE CANDIDATE
|--------------------------------------------------------------------------
*/

function normalizeCandidate(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const profile =
    item.candidateProfile ||
    item.candidate_profile ||
    item.profile ||
    {};

  const application =
    item.application ||
    {};

  const job =
    item.job ||
    application.job ||
    {};

  const candidate =
    item.candidate ||
    {};

  const name =
    item.fullName ||
    item.full_name ||
    item.name ||
    candidate.fullName ||
    candidate.full_name ||
    candidate.name ||
    "Candidate";

  const email =
    item.email ||
    candidate.email ||
    "";

  const role =
    item.role ||
    item.desiredRole ||
    item.desired_role ||
    profile.desiredRole ||
    profile.desired_role ||
    job.title ||
    item.jobTitle ||
    item.job_title ||
    "Candidate";

  const stage =
    item.stage ||
    item.currentStage ||
    item.current_stage ||
    application.stage ||
    application.status ||
    item.status ||
    "Applied";

  const score =
    item.score ??
    item.candidateScore ??
    item.candidate_score ??
    null;

  const location =
    item.location ||
    profile.location ||
    "";

  return {
    id: item.id || candidate.id,

    name,

    email,

    role,

    stage,

    location,

    score:
      score !== null &&
      score !== undefined &&
      score !== ""
        ? formatScore(score)
        : "—",

    initials: getInitials(name),
  };
}

/*
|--------------------------------------------------------------------------
| CANDIDATE ROW
|--------------------------------------------------------------------------
*/

function CandidateListRow({
  name,
  email,
  role,
  stage,
  location,
  score,
  initials,
}) {
  return (
    <div className="px-5 py-4 transition-colors hover:bg-white/[0.02]">

      {/* DESKTOP */}

      <div className="hidden items-center md:grid md:grid-cols-[minmax(250px,1.5fr)_minmax(180px,1fr)_150px_120px] md:gap-5">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-semibold text-blue-300">
            {initials}
          </div>

          <div className="min-w-0">

            <p className="truncate text-xs font-medium text-slate-200">
              {name}
            </p>

            <p className="mt-1 truncate text-[10px] text-slate-600">
              {email || "No email available"}
            </p>

          </div>

        </div>

        <div className="min-w-0">

          <p className="truncate text-xs text-slate-400">
            {role}
          </p>

          {location && (
            <p className="mt-1 truncate text-[10px] text-slate-700">
              {location}
            </p>
          )}

        </div>

        <div>

          <span className="inline-flex rounded-full bg-blue-400/[0.08] px-2.5 py-1 text-[9px] font-medium text-blue-300">
            {stage}
          </span>

        </div>

        <div className="text-right">

          <span className="text-xs font-semibold text-emerald-400">
            {score}
          </span>

        </div>

      </div>

      {/* MOBILE */}

      <div className="flex items-center gap-3 md:hidden">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-semibold text-blue-300">
          {initials}
        </div>

        <div className="min-w-0 flex-1">

          <p className="truncate text-xs font-medium text-slate-200">
            {name}
          </p>

          <p className="mt-1 truncate text-[10px] text-slate-600">
            {email || "No email available"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">

            <span className="rounded-full bg-blue-400/[0.08] px-2 py-1 text-[8px] font-medium text-blue-300">
              {stage}
            </span>

            <span className="text-[9px] text-slate-600">
              {role}
            </span>

          </div>

        </div>

        <span className="text-[11px] font-semibold text-emerald-400">
          {score}
        </span>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

function EmptyCandidateState({ search }) {
  return (
    <div className="px-5 py-16 text-center">

      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.025] text-slate-700">
        <UsersIcon />
      </div>

      <p className="text-xs font-medium text-slate-500">
        {search
          ? "No candidates match your search"
          : "No candidates yet"}
      </p>

      <p className="mt-1 text-[10px] text-slate-700">
        {search
          ? "Try a different name, email or role."
          : "Candidates will appear here when they join your hiring pipeline."}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

function CandidateLoadingRows({ count = 5 }) {
  return (
    <div className="divide-y divide-white/[0.05]">

      {Array.from({ length: count }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-5 py-4"
          >

            <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />

            <div className="flex-1">

              <div className="h-3 w-32 animate-pulse rounded bg-white/[0.05]" />

              <div className="mt-2 h-2.5 w-48 animate-pulse rounded bg-white/[0.04]" />

            </div>

          </div>
        )
      )}

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SIDEBAR
|--------------------------------------------------------------------------
*/

function SidebarItem({
  label,
  icon,
  active = false,
  badge,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
        active
          ? "bg-white/[0.06] text-white"
          : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"
      }`}
    >

      <span
        className={
          active
            ? "text-blue-400"
            : "text-slate-600"
        }
      >
        {icon}
      </span>

      <span className="flex-1 text-xs font-medium">
        {label}
      </span>

      {badge !== undefined && (
        <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-slate-500">
          {badge}
        </span>
      )}

    </button>
  );
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatScore(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return String(value);
  }

  return `${Math.round(numeric)}%`;
}

function getInitials(name) {
  if (!name) {
    return "—";
  }

  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "—";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function DashboardIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21a7 7 0 0114 0" />
      <path d="M16 4.5a4 4 0 010 7.5" />
      <path d="M18 14a5 5 0 014 5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" />
      <path d="M10 12v2h4v-2" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0112 0M15 15a5 5 0 016 5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 19V5M4 19h17" />
      <path d="M8 16l3-4 3 2 5-7" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V20h-2.12v-.4a1.7 1.7 0 00-1.03-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 008.6 15a1.7 1.7 0 00-1.56-1.03H6v-2.12h.4A1.7 1.7 0 007.96 10a1.7 1.7 0 00-.34-1.88l-.06-.06 1.5-1.5.06.06A1.7 1.7 0 0011 6.6 1.7 1.7 0 0012.03 5H12V3h2v2h-.03A1.7 1.7 0 0015 6.6a1.7 1.7 0 001.88-.34l.06-.06 1.5 1.5-.06.06A1.7 1.7 0 0018.04 10a1.7 1.7 0 001.56 1.03H20v2.12h-.4A1.7 1.7 0 0019.4 15z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export default CandidateList;