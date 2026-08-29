import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getHRDashboard,
  getStoredUser,
  logout,
} from "../api";

function HRDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const user = useMemo(() => getStoredUser(), []);

  /*
   * ============================================================
   * LOAD DASHBOARD
   * ============================================================
   */

  const loadDashboard = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        // ========================================================
        // API CONNECTIVITY CHECK
        // ========================================================

        console.log("[HR API] Calling getHRDashboard()...");

        const response = await getHRDashboard();

        console.log("[HR API] API CALL SUCCESS");
        console.log("[HR API] Response:", response);
        console.log(
          "[HR API] Response type:",
          typeof response
        );
        console.log(
          "[HR API] Response keys:",
          Object.keys(response || {})
        );
      

        /*
         * Never trust an unexpected API shape.
         */
        const safeResponse =
          response &&
          typeof response === "object"
            ? response
            : {};

        setDashboard(safeResponse);
      } catch (err) {
        // ========================================================
        // API CONNECTIVITY ERROR
        // ========================================================

        console.error("[HR API] API CALL FAILED");
        console.error("[HR API] Error:", err);
        console.error(
          "[HR API] Message:",
          err?.message
        );
        console.error(
          "[HR API] Response:",
          err?.response
        );
        console.error(
          "[HR API] Response data:",
          err?.response?.data
        );
        console.error(
          "[HR API] Status:",
          err?.response?.status
        );

        setError(
          err?.message ||
            "Unable to load dashboard data."
        );

        /*
         * IMPORTANT:
         *
         * Do not inject fake records here.
         *
         * If the request fails and we already have
         * valid dashboard data, keep displaying it.
         *
         * If this is the first request, dashboard remains
         * null and the UI shows an error/empty state.
         */
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    []
  );

  /*
   * Initial request
   */

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /*
   * ============================================================
   * DERIVED DATA
   * ============================================================
   */

  const sourceStats = dashboard?.stats || {};

  const stats = useMemo(() => {
    return [
      {
        label: "Active candidates",

        value: formatNumber(
          sourceStats.activeCandidates ??
            sourceStats.active_candidates ??
            sourceStats.candidates ??
            sourceStats.totalCandidates ??
            (Array.isArray(dashboard?.candidates)
              ? dashboard.candidates.length
              : Array.isArray(dashboard?.recentCandidates)
                ? dashboard.recentCandidates.length
                : 0)
        ),

        change: formatChange(
          sourceStats.activeCandidatesChange ??
            sourceStats.active_candidates_change
        ),

        positive: getPositive(
          sourceStats.activeCandidatesChange ??
            sourceStats.active_candidates_change
        ),
      },

      {
        label: "Interviews this week",

        value: formatNumber(
          sourceStats.interviewsThisWeek ??
            sourceStats.interviews_this_week ??
            sourceStats.upcomingInterviews ??
            sourceStats.interviews ??
            (Array.isArray(dashboard?.upcomingInterviews)
              ? dashboard.upcomingInterviews.length
              : Array.isArray(dashboard?.interviews)
                ? dashboard.interviews.length
                : 0)
        ),

        change: formatChange(
          sourceStats.interviewsThisWeekChange ??
            sourceStats.interviews_this_week_change
        ),

        positive: getPositive(
          sourceStats.interviewsThisWeekChange ??
            sourceStats.interviews_this_week_change
        ),
      },

      {
        label: "Open positions",

        value: formatNumber(
          sourceStats.openPositions ??
            sourceStats.open_positions ??
            sourceStats.openJobs ??
            sourceStats.open_jobs ??
            (Array.isArray(dashboard?.jobs)
              ? dashboard.jobs.length
              : Array.isArray(dashboard?.openPositionsList)
                ? dashboard.openPositionsList.length
                : 0)
        ),

        change: formatChange(
          sourceStats.openPositionsChange ??
            sourceStats.open_positions_change
        ),

        positive: getPositive(
          sourceStats.openPositionsChange ??
            sourceStats.open_positions_change
        ),
      },

      {
        label: "Avg. time to hire",

        value: formatDuration(
          sourceStats.avgTimeToHire ??
            sourceStats.avg_time_to_hire
        ),

        change: formatChange(
          sourceStats.avgTimeToHireChange ??
            sourceStats.avg_time_to_hire_change
        ),

        positive: getPositive(
          sourceStats.avgTimeToHireChange ??
            sourceStats.avg_time_to_hire_change
        ),
      },
    ];
  }, [sourceStats]);

  /*
   * Interviews
   */

  const interviews = useMemo(() => {
    const source =
      dashboard?.interviews ??
      dashboard?.upcomingInterviews ??
      [];

    if (!Array.isArray(source)) {
      return [];
    }

    return source
      .map(normalizeInterview)
      .filter(Boolean);
  }, [dashboard]);

  /*
   * Candidates
   */

  const candidates = useMemo(() => {
    const source =
      dashboard?.candidates ??
      dashboard?.recentCandidates ??
      [];

    if (!Array.isArray(source)) {
      return [];
    }

    return source
      .map(normalizeCandidate)
      .filter(Boolean);
  }, [dashboard]);

  /*
   * Jobs
   */

  const jobs = useMemo(() => {
    const source =
      dashboard?.jobs ??
      dashboard?.openPositionsList ??
      [];

    if (!Array.isArray(source)) {
      return [];
    }

    return source
      .map(normalizeJob)
      .filter(Boolean);
  }, [dashboard]);

  /*
   * Pipeline
   *
   * Prefer backend pipeline.
   *
   * If backend does not send it, derive it from the
   * real candidate records already received.
   */

  const pipeline = useMemo(() => {
    const source = dashboard?.pipeline;

    if (Array.isArray(source) && source.length > 0) {
      return source
        .map(normalizePipeline)
        .filter(Boolean);
    }

    if (candidates.length > 0) {
      return calculatePipeline(candidates);
    }

    return [];
  }, [dashboard, candidates]);

  /*
   * ============================================================
   * USER / WORKSPACE
   * ============================================================
   */

  const workspaceName =
    dashboard?.workspace?.name ||
    dashboard?.company?.name ||
    user?.company ||
    "Hiring workspace";

  const userName =
    user?.fullName ||
    user?.name ||
    "HR Administrator";

  const workspaceInitials =
    getInitials(workspaceName);

  const userInitials =
    getInitials(userName);

  const firstName =
    userName.split(/\s+/)[0] ||
    "there";

  const todayLabel =
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();

    window.location.replace("/login");
  };

  const handleRetry = () => {
    loadDashboard();
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/[0.07] bg-[#090e18] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Brand */}

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
              Hire<span className="text-slate-500">
                Flow
              </span>
            </span>

          </Link>

        </div>

        {/* Workspace */}

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

        {/* Navigation */}

        <nav className="mt-7 flex-1 px-4">

          <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Workspace
          </p>

          <SidebarItem
            active
            label="Overview"
            icon={<DashboardIcon />}
          />

        <SidebarItem
                label="Candidates"
                badge={stats[0]?.value}
                icon={<UsersIcon />}
                link="/candidatelist"
                />

          <SidebarItem
            label="Interviews"
            badge={stats[1]?.value}
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

        {/* User */}

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

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="lg:pl-[250px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#070b14]/90 px-5 backdrop-blur-xl sm:px-7 lg:px-9">

          <div className="flex min-w-0 items-center gap-4">

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] text-slate-400 lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon />
            </button>

            <div className="min-w-0">

              <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                {todayLabel}
              </p>

              <h1 className="mt-0.5 truncate text-lg font-semibold tracking-[-0.025em] text-white sm:text-xl">
                Good evening, {firstName}
              </h1>

            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            <button
              type="button"
              className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 text-xs text-slate-600 transition-colors hover:text-slate-300 sm:flex"
            >
              <SearchIcon />

              Search

              <span className="ml-4 rounded border border-white/[0.07] px-1.5 py-0.5 text-[9px]">
                /
              </span>

            </button>

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-slate-500 transition-colors hover:text-white"
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

          {/* API ERROR */}

          {error && (
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-medium text-red-300">
                  Dashboard data unavailable
                </p>

                <p className="mt-1 text-[10px] text-red-300/60">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={handleRetry}
                disabled={loading}
                className="w-fit rounded-lg border border-red-400/10 px-3 py-1.5 text-[10px] text-red-300 transition-colors hover:bg-red-400/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Retry
              </button>

            </div>
          )}

          {/* PAGE HEADER */}

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-400/[0.05] px-3 py-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />

                <span className="text-[10px] font-medium text-blue-300">
                  Hiring overview
                </span>

              </div>

              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                Your hiring at a glance
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Track candidates, interviews and open positions from one place.
              </p>

            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]"
            >
              <span className="text-base leading-none">
                +
              </span>

              New position
            </button>

          </div>

          {/* STATS */}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                {...stat}
                loading={loading}
              />
            ))}

          </div>

          {/* MAIN GRID */}

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">

            {/* UPCOMING INTERVIEWS */}

            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c121e]/80">

              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

                <div>

                  <h3 className="text-sm font-semibold text-white">
                    Upcoming interviews
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Your schedule for today
                  </p>

                </div>

                <button
                  type="button"
                  className="text-[11px] font-medium text-slate-500 transition-colors hover:text-blue-400"
                >
                  View calendar →
                </button>

              </div>

              <div className="divide-y divide-white/[0.05]">

                {loading ? (
                  <LoadingRows count={4} />
                ) : interviews.length > 0 ? (
                  interviews.map((interview, index) => (
                    <InterviewRow
                      key={
                        interview.id ||
                        interview.email ||
                        `interview-${index}`
                      }
                      {...interview}
                    />
                  ))
                ) : (
                  <EmptyState message="No upcoming interviews" />
                )}

              </div>

            </section>

            {/* PIPELINE */}

            <section className="rounded-2xl border border-white/[0.07] bg-[#0c121e]/80 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-sm font-semibold text-white">
                    Hiring pipeline
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Candidate distribution
                  </p>

                </div>

                <button
                  type="button"
                  className="text-slate-600 transition-colors hover:text-white"
                  aria-label="Pipeline options"
                >
                  <MoreIcon />
                </button>

              </div>

              <div className="mt-7 space-y-5">

                {loading ? (
                  <PipelineLoading />
                ) : pipeline.length > 0 ? (
                  pipeline.map((item) => (
                    <PipelineRow
                      key={item.label}
                      {...item}
                    />
                  ))
                ) : (
                  <EmptyState message="No candidate pipeline data" />
                )}

              </div>

            </section>

          </div>

          {/* BOTTOM GRID */}

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

            {/* RECENT CANDIDATES */}

            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c121e]/80">

              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

                <div>

                  <h3 className="text-sm font-semibold text-white">
                    Recent candidates
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Latest candidate activity
                  </p>

                </div>

                <button
                  type="button"
                  className="text-[11px] font-medium text-slate-500 transition-colors hover:text-blue-400"
                >
                  View all →
                </button>

              </div>

              <div className="divide-y divide-white/[0.05]">

                {loading ? (
                  <LoadingRows count={4} />
                ) : candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <CandidateRow
                      key={
                        candidate.id ||
                        candidate.email ||
                        `candidate-${index}`
                      }
                      {...candidate}
                    />
                  ))
                ) : (
                  <EmptyState message="No candidates yet" />
                )}

              </div>

            </section>

            {/* OPEN POSITIONS */}

            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c121e]/80">

              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

                <div>

                  <h3 className="text-sm font-semibold text-white">
                    Open positions
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Active roles across your team
                  </p>

                </div>

                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-white"
                  aria-label="Create position"
                >
                  +
                </button>

              </div>

              <div className="divide-y divide-white/[0.05]">

                {loading ? (
                  <LoadingRows count={3} />
                ) : jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <JobRow
                      key={
                        job.id ||
                        `${job.title}-${index}`
                      }
                      {...job}
                    />
                  ))
                ) : (
                  <EmptyState message="No open positions" />
                )}

              </div>

              <div className="border-t border-white/[0.06] p-4">

                <button
                  type="button"
                  className="w-full rounded-lg border border-white/[0.07] py-2.5 text-[11px] font-medium text-slate-400 transition-colors hover:bg-white/[0.025] hover:text-white"
                >
                  Manage all positions
                </button>

              </div>

            </section>

          </div>

          {/* REFRESH INDICATOR */}

          {refreshing && (
            <div className="fixed bottom-5 right-5 z-50 rounded-full border border-white/[0.08] bg-[#0c121e]/95 px-3 py-2 text-[10px] text-slate-500 shadow-2xl backdrop-blur-xl">
              Updating dashboard...
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

/* =============================================================
   NORMALIZERS
============================================================= */

function normalizeInterview(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const candidate =
    item.candidate || {};

  const job =
    item.job || {};

  const name =
    candidate.fullName ||
    candidate.full_name ||
    candidate.name ||
    item.candidateName ||
    item.candidate_name ||
    item.name ||
    "Candidate";

  const scheduledAt =
    item.scheduledAt ||
    item.scheduled_at ||
    item.startTime ||
    item.start_time ||
    item.date;

  return {
    id: item.id,

    name,

    email:
      candidate.email ||
      item.candidateEmail ||
      item.candidate_email ||
      item.email ||
      "",

    role:
      job.title ||
      item.jobTitle ||
      item.job_title ||
      item.role ||
      "Interview",

    time: formatTime(scheduledAt),

    type:
      item.type ||
      item.interviewType ||
      item.interview_type ||
      "Interview",

    status:
      normalizeStatus(item.status) ||
      "Scheduled",

    initials: getInitials(name),
  };
}

function normalizeCandidate(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const candidate =
    item.candidate || {};

  const name =
    item.fullName ||
    item.full_name ||
    item.name ||
    candidate.fullName ||
    candidate.full_name ||
    candidate.name ||
    "Candidate";

  return {
    id: item.id,

    name,

    email:
      item.email ||
      candidate.email ||
      "",

    role:
      item.job?.title ||
      item.jobTitle ||
      item.job_title ||
      item.role ||
      item.desiredRole ||
      item.desired_role ||
      item.candidateProfile?.desiredRole ||
      item.candidate_profile?.desired_role ||
      "Candidate",

    stage:
      item.stage ||
      item.currentStage ||
      item.current_stage ||
      item.status ||
      "Applied",

    score:
      item.score !== undefined &&
      item.score !== null
        ? formatScore(item.score)
        : "—",

    initials: getInitials(name),
  };
}

function normalizeJob(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return {
    id: item.id,

    title:
      item.title ||
      item.name ||
      "Untitled position",

    department:
      item.department ||
      item.team ||
      "—",

    candidates:
      toNumber(
        item.candidates ??
          item.candidateCount ??
          item.candidate_count
      ),

    status:
      item.status ||
      "Active",
  };
}

function normalizePipeline(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const count = toNumber(
    item.count ??
      item.total ??
      item.candidates
  );

  const percentage = clamp(
    toNumber(
      item.percentage ??
        item.percent
    ),
    0,
    100
  );

  return {
    label:
      item.label ||
      item.stage ||
      item.name ||
      "Unknown",

    count,

    percentage,
  };
}

/* =============================================================
   PIPELINE DERIVATION
============================================================= */

function calculatePipeline(candidates) {
  if (!Array.isArray(candidates) || !candidates.length) {
    return [];
  }

  const stages = [
    "Applied",
    "Screening",
    "Technical",
    "Final interview",
    "Offer",
  ];

  const total = candidates.length;

  return stages.map((stage) => {
    const count = candidates.filter(
      (candidate) =>
        normalizeStage(candidate.stage) ===
        normalizeStage(stage)
    ).length;

    return {
      label: stage,
      count,
      percentage: Math.round(
        (count / total) * 100
      ),
    };
  });
}

function normalizeStage(stage) {
  return String(stage || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =============================================================
   FORMATTING
============================================================= */

function formatTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value) {
  return toNumber(value).toLocaleString();
}

function formatDuration(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "—";
  }

  return `${numeric}d`;
}

function formatChange(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "—";
  }

  return `${numeric > 0 ? "+" : ""}${numeric}%`;
}

function formatScore(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return String(value);
  }

  return `${Math.round(numeric)}%`;
}

function normalizeStatus(status) {
  if (!status) {
    return "";
  }

  const value = String(status)
    .toLowerCase()
    .trim();

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

/* =============================================================
   SAFE NUMBER HELPERS
============================================================= */

function toNumber(value) {
  const numeric = Number(value);

  return Number.isFinite(numeric)
    ? numeric
    : 0;
}

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function getPositive(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return true;
  }

  const numeric = Number(
    String(value).replace("%", "")
  );

  if (!Number.isFinite(numeric)) {
    return true;
  }

  return numeric >= 0;
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

/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
  label,
  value,
  change,
  positive,
  loading,
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#0c121e]/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.11] hover:bg-[#0d1421]">

      <div className="flex items-start justify-between">

        <p className="text-[11px] font-medium text-slate-500">
          {label}
        </p>

        <div className="h-7 w-7 rounded-lg border border-white/[0.06] bg-white/[0.025]" />

      </div>

      <div className="mt-4 flex items-end justify-between">

        {loading ? (
          <div className="h-7 w-16 animate-pulse rounded bg-white/[0.05]" />
        ) : (
          <p className="text-2xl font-semibold tracking-[-0.04em] text-white">
            {value}
          </p>
        )}

        {!loading && (
          <span
            className={`text-[10px] font-medium ${
              positive
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {change}
          </span>
        )}

      </div>

    </div>
  );
}

/* =============================================================
   SIDEBAR ITEM
============================================================= */

function SidebarItem({
  label,
  icon,
  active = false,
  badge,
  link,
}) {
  const className = `mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
    active
      ? "bg-white/[0.06] text-white"
      : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"
  }`;

  const content = (
    <>
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
        <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-slate-600">
          {badge}
        </span>
      )}
    </>
  );

  if (link) {
    return (
      <Link
        to={link}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
    >
      {content}
    </button>
  );
}

/* =============================================================
   INTERVIEW ROW
============================================================= */

function InterviewRow({
  name,
  role,
  time,
  type,
  status,
  initials,
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]">

      <div className="hidden w-16 shrink-0 sm:block">

        <p className="text-xs font-semibold text-white">
          {time}
        </p>

        <p className="mt-1 text-[9px] text-slate-600">
          Today
        </p>

      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-semibold text-blue-300">
        {initials}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-xs font-medium text-slate-200">
          {name}
        </p>

        <p className="mt-1 truncate text-[10px] text-slate-600">
          {role}
        </p>

      </div>

      <div className="hidden md:block">

        <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] text-slate-500">
          {type}
        </span>

      </div>

      <span
        className={`hidden rounded-full px-2.5 py-1 text-[9px] font-medium sm:block ${
          status.toLowerCase() ===
          "confirmed"
            ? "bg-emerald-400/[0.08] text-emerald-400"
            : "bg-amber-400/[0.08] text-amber-400"
        }`}
      >
        {status}
      </span>

      <button
        type="button"
        className="text-slate-700 transition-colors hover:text-white"
        aria-label="Interview options"
      >
        <MoreIcon />
      </button>

    </div>
  );
}

/* =============================================================
   PIPELINE ROW
============================================================= */

function PipelineRow({
  label,
  count,
  percentage,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-[11px] text-slate-400">
          {label}
        </span>

        <span className="text-[10px] font-medium text-slate-500">
          {count}
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
          style={{
            width: `${clamp(
              percentage,
              0,
              100
            )}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =============================================================
   CANDIDATE ROW
============================================================= */

function CandidateRow({
  name,
  role,
  stage,
  score,
  initials,
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-[10px] font-semibold text-slate-400">
        {initials}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-xs font-medium text-slate-200">
          {name}
        </p>

        <p className="mt-1 truncate text-[10px] text-slate-600">
          {role}
        </p>

      </div>

      <div className="hidden text-right sm:block">

        <p className="text-[10px] text-slate-500">
          {stage}
        </p>

        <p className="mt-1 text-[9px] text-slate-700">
          Candidate score
        </p>

      </div>

      <span className="text-[11px] font-semibold text-emerald-400">
        {score}
      </span>

    </div>
  );
}

/* =============================================================
   JOB ROW
============================================================= */

function JobRow({
  title,
  department,
  candidates,
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-blue-400">
        <BriefcaseIcon />
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-xs font-medium text-slate-200">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-slate-600">
          {department}
        </p>

      </div>

      <div className="text-right">

        <p className="text-xs font-medium text-white">
          {candidates}
        </p>

        <p className="mt-1 text-[9px] text-slate-700">
          candidates
        </p>

      </div>

    </div>
  );
}

/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyState({ message }) {
  return (
    <div className="px-5 py-10 text-center">

      <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.025] text-slate-700">
        —
      </div>

      <p className="text-xs text-slate-600">
        {message}
      </p>

    </div>
  );
}

/* =============================================================
   LOADING
============================================================= */

function LoadingRows({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-5 py-4"
          >

            <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.05]" />

            <div className="flex-1">

              <div className="h-3 w-32 animate-pulse rounded bg-white/[0.05]" />

              <div className="mt-2 h-2.5 w-24 animate-pulse rounded bg-white/[0.04]" />

            </div>

          </div>
        )
      )}
    </>
  );
}

function PipelineLoading() {
  return (
    <div className="space-y-5">

      {[1, 2, 3, 4, 5].map(
        (item) => (
          <div key={item}>

            <div className="mb-2 flex justify-between">

              <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]" />

              <div className="h-2.5 w-5 animate-pulse rounded bg-white/[0.05]" />

            </div>

            <div className="h-1.5 animate-pulse rounded bg-white/[0.05]" />

          </div>
        )
      )}

    </div>
  );
}

/* =============================================================
   ICONS
============================================================= */

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

function MoreIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export default HRDashboard;