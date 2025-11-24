import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-surface border border-slate-800 shadow-2xl',
            headerTitle: 'text-slate-100',
            headerSubtitle: 'text-slate-400',
            socialButtonsBlockButton: 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700',
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            formFieldInput: 'bg-[#0f172a] border-slate-700 text-slate-100',
            footerActionLink: 'text-blue-400 hover:text-blue-300',
          },
        }}
      />
    </div>
  );
}
