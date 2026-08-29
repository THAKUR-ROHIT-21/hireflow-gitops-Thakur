import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCandidateDashboard,
  getStoredUser,
  logout,
} from "../api";

function CandidateDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getStoredUser();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCandidateDashboard();

      console.log("Candidate dashboard:", response);

      setData(response);
    } catch (err) {
      console.error("Candidate dashboard failed:", err);

      setError(
        err?.message ||
          "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
          Loading your workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#070b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.06] text-[11px] font-bold">
              H
            </div>

            <span className="text-[20px] font-semibold tracking-[-0.045em]">
              Hire<span className="text-slate-500">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-white">
                {user?.fullName || user?.name || "Candidate"}
              </p>

              <p className="text-[11px] text-slate-600">
                {user?.email || ""}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-400">
            Candidate workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Welcome back
            {user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Track your interviews, upcoming rounds, completed interviews
            and interviewer feedback.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-red-300">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-xs text-red-300/60">
                {error}
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="rounded-lg border border-red-300/10 px-4 py-2 text-xs font-medium text-red-200 hover:bg-red-300/[0.06]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Real statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Upcoming"
            value={
              data?.upcoming?.length ??
              data?.stats?.upcoming ??
              0
            }
          />

          <StatCard
            label="Completed"
            value={
              data?.completed?.length ??
              data?.stats?.completed ??
              0
            }
          />

          <StatCard
            label="Active rounds"
            value={
              data?.activeRounds?.length ??
              data?.stats?.activeRounds ??
              0
            }
          />

          <StatCard
            label="Feedback"
            value={
              data?.feedback?.length ??
              data?.stats?.feedback ??
              0
            }
          />
        </div>

        {/* Upcoming interviews */}
        <section className="mt-10">
          <SectionHeader
            eyebrow="Schedule"
            title="Upcoming interviews"
          />

          <InterviewList
            interviews={data?.upcoming || []}
            emptyMessage="No upcoming interviews."
          />
        </section>

        {/* Completed */}
        <section className="mt-10">
          <SectionHeader
            eyebrow="History"
            title="Completed interviews"
          />

          <InterviewList
            interviews={data?.completed || []}
            emptyMessage="No completed interviews yet."
          />
        </section>

        {/* Feedback */}
        <section className="mt-10 pb-12">
          <SectionHeader
            eyebrow="Evaluation"
            title="Interviewer feedback"
          />

          <FeedbackList
            feedback={data?.feedback || []}
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
    </div>
  );
}

function InterviewList({ interviews, emptyMessage }) {
  if (!interviews.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-12 text-center">
        <p className="text-sm text-slate-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
      {interviews.map((interview, index) => (
        <div
          key={
            interview.id ||
            interview.interviewId ||
            index
          }
          className="border-b border-white/[0.06] p-5 last:border-b-0"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {interview.title ||
                  interview.position ||
                  interview.role ||
                  "Interview"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {interview.company ||
                  interview.companyName ||
                  "Company"}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-medium text-slate-300">
                {formatDate(
                  interview.scheduledAt ||
                    interview.startTime ||
                    interview.date
                )}
              </p>

              <StatusBadge
                status={interview.status}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedbackList({ feedback }) {
  if (!feedback.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-12 text-center">
        <p className="text-sm text-slate-500">
          No interviewer feedback available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {feedback.map((item, index) => (
        <div
          key={item.id || index}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white">
              {item.interviewTitle ||
                item.interview?.title ||
                "Interview feedback"}
            </p>

            {item.rating !== undefined &&
              item.rating !== null && (
                <span className="text-sm font-semibold text-cyan-300">
                  {item.rating}/5
                </span>
              )}
          </div>

          {item.comment && (
            <p className="mt-4 text-sm leading-6 text-slate-400">
              {item.comment}
            </p>
          )}

          {item.feedback && (
            <p className="mt-4 text-sm leading-6 text-slate-400">
              {item.feedback}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  if (!status) {
    return null;
  }

  const normalized = String(status).toLowerCase();

  let classes =
    "border-white/10 bg-white/[0.04] text-slate-400";

  if (
    normalized === "scheduled" ||
    normalized === "confirmed" ||
    normalized === "upcoming"
  ) {
    classes =
      "border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300";
  }

  if (
    normalized === "completed" ||
    normalized === "passed"
  ) {
    classes =
      "border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300";
  }

  if (
    normalized === "cancelled" ||
    normalized === "rejected"
  ) {
    classes =
      "border-red-400/10 bg-red-400/[0.06] text-red-300";
  }

  return (
    <span
      className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize ${classes}`}
    >
      {status}
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "Date not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default CandidateDashboard;