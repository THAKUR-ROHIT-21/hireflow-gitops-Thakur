import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="overflow-hidden bg-[#070b14] text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[820px] border-b border-white/[0.06]">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0">

          {/* Main ambient glow */}
          <div className="absolute left-[45%] top-[-220px] h-[650px] w-[800px] rounded-full bg-blue-600/15 blur-[150px]" />

          {/* Right glow */}
          <div className="absolute right-[-120px] top-[25%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_35%,transparent_10%,#070b14_78%)]" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">

          {/* Hero content */}
          <div className="grid min-h-[820px] items-center gap-12 py-24 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8 lg:py-28">

            {/* =====================================================
                LEFT
            ===================================================== */}
            <div className="relative z-20 max-w-2xl">

              {/* Eyebrow */}
              

              {/* Heading */}
              <h1 className="text-[52px] font-semibold leading-[0.98] tracking-[-0.06em] sm:text-[68px] lg:text-[78px] xl:text-[88px]">

                Hiring moves
                <br />

                <span className="text-white">
                  fast.
                </span>

                <br />

                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Interviews should too.
                </span>

              </h1>

              {/* Description */}
              <p className="mt-8 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                HireFlow gives hiring teams a focused way to schedule
                interviews, coordinate candidates, and keep every step moving.
              </p>

              {/* Actions */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register/hr"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-[0_0_45px_rgba(59,130,246,0.22)]"
                >
                  Start hiring

                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.5 10a.75.75 0 01.75-.75h10.19l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H4.25A.75.75 0 013.5 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                <Link
                  to="/register/candidate"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  I'm a candidate
                </Link>

              </div>

              {/* Trust line */}
              <div className="mt-6 flex items-center gap-4 text-xs text-slate-600">

                <span>Built for modern hiring teams</span>

                <span className="h-1 w-1 rounded-full bg-slate-700" />

                <span>Simple workflow</span>

              </div>

              {/* Vertical label */}
              <div className="absolute -left-10 top-1/2 hidden -translate-y-1/2 -rotate-90 xl:block">

                <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-700">
                  Hiring infrastructure
                </span>

              </div>

            </div>


            {/* =====================================================
                RIGHT VISUAL
            ===================================================== */}
            <div className="relative min-h-[560px] lg:min-h-[650px]">

              {/* Main glow */}
              <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[110px]" />

              {/* Orbit rings */}
              <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

              <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045]" />

              <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10" />


              {/* =================================================
                  CENTER NODE
              ================================================= */}
              <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">

                <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border border-blue-400/20 bg-[#0d1525]/90 shadow-[0_0_80px_rgba(59,130,246,0.18)] backdrop-blur-2xl">

                  {/* rotating glow */}
                  <div className="absolute inset-[-10px] animate-pulse rounded-[34px] border border-blue-400/10" />

                  <div className="text-center">

                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                      H
                    </div>

                    <p className="mt-2 text-[10px] font-semibold text-white">
                      HireFlow
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-500">
                      Interview hub
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CARD 1
              ================================================= */}
              <div className="absolute left-[1%] top-[8%] z-10 w-[210px] animate-[floatOne_6s_ease-in-out_infinite] sm:left-[6%]">

                <div className="rounded-2xl border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">

                  <div className="flex items-center justify-between">

                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Interview
                    </span>

                    <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[8px] font-medium text-emerald-400">
                      Confirmed
                    </span>

                  </div>

                  <div className="mt-4 flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 text-[9px] font-semibold text-blue-300">
                      RS
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Rahul Sharma
                      </p>

                      <p className="mt-1 text-[9px] text-slate-500">
                        Senior Backend Engineer
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">

                    <span className="text-[9px] text-slate-500">
                      Today
                    </span>

                    <span className="text-[10px] font-medium text-slate-300">
                      10:00 AM
                    </span>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CARD 2
              ================================================= */}
              <div className="absolute right-[0%] top-[18%] z-10 w-[205px] animate-[floatTwo_7s_ease-in-out_infinite] sm:right-[3%]">

                <div className="rounded-2xl border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">

                  <div className="flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="4" width="18" height="17" rx="2" />
                        <path d="M16 2v4M8 2v4M3 9h18" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-white">
                        New interview
                      </p>

                      <p className="text-[8px] text-slate-600">
                        Just now
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">

                    <p className="text-[9px] text-slate-500">
                      Product Designer
                    </p>

                    <p className="mt-1 text-xs font-medium text-white">
                      Priya Singh
                    </p>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-[8px] text-slate-600">
                      Candidate notified
                    </span>

                    <span className="text-[10px] text-emerald-400">
                      ✓
                    </span>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CARD 3
              ================================================= */}
              <div className="absolute bottom-[9%] left-[4%] z-10 w-[190px] animate-[floatThree_6.5s_ease-in-out_infinite] sm:left-[10%]">

                <div className="rounded-2xl border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">

                  <div className="flex items-center justify-between">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      This week
                    </p>

                    <span className="text-[9px] text-blue-400">
                      +18%
                    </span>

                  </div>

                  <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    24
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    interviews scheduled
                  </p>

                  <div className="mt-4 flex h-8 items-end gap-1">

                    <span className="h-[35%] flex-1 rounded-sm bg-blue-500/20" />
                    <span className="h-[48%] flex-1 rounded-sm bg-blue-500/30" />
                    <span className="h-[42%] flex-1 rounded-sm bg-blue-500/30" />
                    <span className="h-[65%] flex-1 rounded-sm bg-blue-500/40" />
                    <span className="h-[58%] flex-1 rounded-sm bg-blue-500/50" />
                    <span className="h-[82%] flex-1 rounded-sm bg-blue-500/60" />
                    <span className="h-full flex-1 rounded-sm bg-blue-400" />

                  </div>

                </div>

              </div>


              {/* =================================================
                  CARD 4
              ================================================= */}
              <div className="absolute bottom-[3%] right-[3%] z-10 w-[210px] animate-[floatFour_7s_ease-in-out_infinite] sm:right-[8%]">

                <div className="rounded-2xl border border-white/10 bg-[#0d1422]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">

                  <div className="flex items-center gap-3">

                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">

                      <span className="absolute h-9 w-9 animate-ping rounded-full bg-emerald-400/10" />

                      <span className="relative text-xs">
                        ✓
                      </span>

                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Interview confirmed
                      </p>

                      <p className="mt-1 text-[9px] text-slate-500">
                        Candidate accepted the invite
                      </p>
                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  SMALL ORBIT DOTS
              ================================================= */}
              <span className="absolute left-[27%] top-[38%] h-2 w-2 animate-pulse rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" />

              <span className="absolute right-[24%] top-[46%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.8)]" />

              <span className="absolute bottom-[28%] left-[45%] h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />

            </div>

          </div>

        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070b14] to-transparent" />

      </section>


      {/* =========================================================
          VALUE STRIP
      ========================================================= */}
      <section className="border-b border-white/[0.06] bg-[#090f1b]">

        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-12">

          <div className="flex items-start gap-4">

            <span className="text-xs font-semibold text-blue-400">
              01
            </span>

            <div>
              <h3 className="text-sm font-semibold text-white">
                One source of truth
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Candidates, interviewers and schedules stay connected.
              </p>
            </div>

          </div>

          <div className="flex items-start gap-4">

            <span className="text-xs font-semibold text-cyan-400">
              02
            </span>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Less coordination
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Remove unnecessary scheduling back-and-forth.
              </p>
            </div>

          </div>

          <div className="flex items-start gap-4">

            <span className="text-xs font-semibold text-indigo-400">
              03
            </span>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Built for hiring
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                A workflow designed around interviews from the start.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section className="bg-[#070b14]">

        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12">

          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                The workflow
              </p>

              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                Everything stays
                <span className="text-slate-600">
                  {" "}in motion.
                </span>
              </h2>

            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-500 lg:ml-auto">
              HireFlow gives your team a clean system for creating,
              coordinating and tracking interviews without turning the
              process into another project-management nightmare.
            </p>

          </div>


          <div className="mt-16 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 transition duration-500 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.04]">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                01
              </div>

              <h3 className="mt-7 text-base font-semibold text-white">
                Smart scheduling
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Create an interview with the candidate, interviewer, time
                and format without unnecessary steps.
              </p>

            </div>


            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 transition duration-500 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.04]">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                02
              </div>

              <h3 className="mt-7 text-base font-semibold text-white">
                Candidate coordination
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Keep candidate information, interview details and activity
                organized from invitation to completion.
              </p>

            </div>


            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 transition duration-500 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.04]">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                03
              </div>

              <h3 className="mt-7 text-base font-semibold text-white">
                Clear status
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Know what is scheduled, confirmed, pending, completed or
                cancelled at a glance.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#070b14] px-5 py-28 sm:px-8 lg:px-12">

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="relative mx-auto max-w-4xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Start with HireFlow
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            Make interviews
            <span className="text-slate-600">
              {" "}flow.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
            Give your hiring team a cleaner way to manage interviews from
            first invitation to final conversation.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/register/hr"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]"
            >
              Create HR account
            </Link>

            <Link
              to="/register/candidate"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
            >
              Join as candidate
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================================
          ANIMATIONS
      ========================================================= */}
      <style>{`

        @keyframes floatOne {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-1deg);
          }

          50% {
            transform: translate3d(8px, -14px, 0) rotate(1deg);
          }
        }

        @keyframes floatTwo {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(1deg);
          }

          50% {
            transform: translate3d(-10px, 12px, 0) rotate(-1deg);
          }
        }

        @keyframes floatThree {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(10px, -10px, 0);
          }
        }

        @keyframes floatFour {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-8px, -12px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }

      `}</style>

    </main>
  );
}

export default Home;