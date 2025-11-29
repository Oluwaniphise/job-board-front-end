import Link from "next/link";

const features = [
  {
    title: "Browse curated roles",
    description:
      "Discover published jobs with clear descriptions, requirements, and salary ranges.",
  },
  {
    title: "Showcase your profile",
    description:
      "Keep your details updated so employers and hiring managers can spot you faster.",
  },
  {
    title: "Track every application",
    description:
      "Apply with a resume and cover letter, then monitor application status in one place.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100 ring-1 ring-blue-500/40">
              Job Application Dashboard
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Find the right job. Share your story. Track your progress.
            </h1>
            <p className="text-lg text-slate-200/80">
              J.A.D helps candidates apply with confidence and gives employers a
              clean view of every application. Browse roles, apply once, and
              stay in the loop.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Sign In
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-200/70">
              <div>
                <p className="text-3xl font-bold text-white">Post</p>
                <p>Employers create roles in minutes.</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Apply</p>
                <p>Candidates submit once per role.</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Track</p>
                <p>Stay updated on every application.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-blue-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 p-4 text-sm">
                <div className="space-y-1">
                  <p className="text-slate-200">Senior Backend Engineer</p>
                  <p className="text-slate-400">Hybrid • $120k - $150k</p>
                </div>
                <Link
                  href="/auth/login"
                  className="rounded-md bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  Apply
                </Link>
              </div>
              <div className="mt-4 space-y-3 rounded-2xl bg-slate-900/40 p-4">
                <p className="text-sm text-slate-300">What you get with J.A.D</p>
                <ul className="space-y-2 text-sm text-slate-200/70">
                  <li>• Clear salary ranges and requirements</li>
                  <li>• One-click apply with resume upload</li>
                  <li>• Status tracking for every submission</li>
                  <li>• Employer dashboards to review applications</li>
                </ul>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900/60 p-4 text-sm text-slate-200/80">
                <span>Ready to get started?</span>
                <Link
                  href="/auth/signup"
                  className="rounded-md border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:border-white/40 hover:bg-white/5"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-200/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
