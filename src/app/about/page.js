import { Navbar } from "@/components/layout/Navbar";
import { BookOpen, Library, Users, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
              Our Mission
            </div>
            <h1 className="font-display font-black text-6xl md:text-7xl text-slate-900 tracking-tight leading-tight">
              Making Knowledge <br />
              <span className="text-blue-600">Limitless.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Libzone was founded on the belief that access to information should be as fluid as the internet itself. We&apos;re rebuilding library systems for the digital-native generation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-3xl text-slate-900">Who We Are</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Born in 2024, Libzone started as a small project to help university students manage their physical and digital reading lists. Today, we&apos;re a global platform serving over 150 institutions.
              </p>
              <p className="text-slate-500 font-medium leading-relaxed">
                We are a team of educators, designers, and engineers dedicated to creating the most elegant and efficient tools for academic success.
              </p>
            </div>
            <div className="bg-slate-50 rounded-[40px] p-10 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full"></div>
                <Library className="relative z-10 w-32 h-32 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
            {[
              { label: "Founded", val: "2024", icon: BookOpen },
              { label: "Partners", val: "150+", icon: Library },
              { label: "Users", val: "10k+", icon: Users },
              { label: "Uptime", val: "99.9%", icon: ShieldCheck },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-display font-black text-3xl text-slate-900">{stat.val}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              );
            })}
          </div>
          <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 text-center space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
            <h2 className="font-display font-bold text-4xl text-white relative z-10">Join the movement.</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium relative z-10">
              Whether you&apos;re an administrator looking to upgrade your campus or a student ready for a better way to read, Libzone is here for you.
            </p>
            <div className="flex justify-center relative z-10">
              <a href="/signup" className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl">
                Start for Free
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
