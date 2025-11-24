import { notFound } from 'next/navigation';

export default function VerifyPage({ params }: { params: { code: string } }) {
  // This would be a server component that queries Convex
  // For now, return a placeholder

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full bg-surface rounded-2xl border border-slate-800 p-8 text-center">
        <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
          <svg className="w-16 h-16 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-100 mb-4">
          Certificate Verified ✓
        </h1>

        <p className="text-slate-300 mb-8">
          This certificate is authentic and was issued by Marlion Technologies.
        </p>

        <div className="bg-slate-800/50 rounded-xl p-6 text-left space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Verification Code</p>
            <p className="text-slate-100 font-mono">{params.code}</p>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-1">Student Name</p>
            <p className="text-slate-100">Loading...</p>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-1">Program</p>
            <p className="text-slate-100">Winter Internship 2025</p>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-1">Issue Date</p>
            <p className="text-slate-100">Loading...</p>
          </div>
        </div>

        <p className="mt-8 text-slate-500 text-sm">
          This certificate can be verified at marliontech.com/verify
        </p>
      </div>
    </div>
  );
}
