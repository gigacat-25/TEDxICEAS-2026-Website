import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ted-red/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[400px] space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
              TEDx<span className="text-ted-red">ICEAS</span>
            </h1>
          </Link>
          <p className="text-white/40 text-sm uppercase tracking-widest font-bold">
            Create your attendee account
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-black border border-white/10 shadow-2xl rounded-2xl",
                headerTitle: "text-white text-xl font-bold",
                headerSubtitle: "text-white/60",
                socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                socialButtonsBlockButtonText: "text-white font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-white/40",
                formFieldLabel: "text-white/60 text-xs uppercase tracking-widest font-bold",
                formFieldInput: "bg-white/5 border-white/10 text-white focus:border-ted-red focus:ring-1 focus:ring-ted-red/20",
                formButtonPrimary: "bg-ted-red hover:bg-red-700 text-sm font-bold uppercase tracking-widest transition-all",
                footerActionText: "text-white/40",
                footerActionLink: "text-ted-red hover:text-red-400 font-bold",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-ted-red",
                formResendCodeLink: "text-ted-red",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
