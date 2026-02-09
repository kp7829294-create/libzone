import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ShieldCheck, Zap, Globe, Library, ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-blue-200/50 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm text-blue-700 text-sm font-bold mx-auto lg:mx-0">
                <span className="relative flex h-2.5 w-2.5 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                Trusted by 150+ Institutions Worldwide
              </div>
              <h1 className="font-display font-black text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-slate-900 tracking-tight">
                Read. Learn. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">Succeed.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                The library management system that works as fast as you do. Experience the future of knowledge sharing with <span className="text-blue-600 font-bold">Libzone</span>.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-700 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 rounded-2xl group border-b-4 border-blue-800">
                    Get Started Free
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white rounded-2xl gap-3 font-bold shadow-sm transition-all hover:shadow-md active:scale-95">
                    <Play className="h-5 w-5 fill-blue-600 text-blue-600" />
                    Live Preview
                  </Button>
                </Link>
              </div>
              <div className="pt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-xs overflow-hidden shadow-md ring-1 ring-slate-100">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 50}`} alt="user" width={48} height={48} />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-md ring-1 ring-slate-100">10K+</div>
                </div>
                <div className="text-left">
                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Zap key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 font-bold tracking-tight uppercase">5-Star Platform Experience</p>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600/20 blur-[150px] rounded-full animate-pulse duration-[5000ms]"></div>
              <div className="relative group">
                <Image src="/hero-illustration.png" alt="Libzone Interface" width={600} height={400} className="relative z-10 w-full max-w-[600px] h-auto object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.15)] rounded-3xl" />
              </div>
              <div className="absolute top-1/4 -right-8 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl border border-white/50 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-green-600 h-5 w-5" />
                  </div>
                  <p className="text-sm font-black text-slate-800 tracking-tight">Enterprise Grade Security</p>
                </div>
              </div>
              <div className="absolute bottom-1/4 -left-12 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl border border-white/50 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Zap className="text-amber-600 h-5 w-5" />
                  </div>
                  <p className="text-sm font-black text-slate-800 tracking-tight">Real-time Synchronization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-6 tracking-tight">Built for the next generation</h2>
            <p className="text-xl text-slate-500 font-medium">Libzone replaces clunky legacy systems with a breath of fresh air.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Smart Discovery", desc: "Our engine suggests your next favorite read based on your interests and history.", icon: Library },
              { title: "Instant Access", desc: "Borrow and read in seconds. No paperwork, no waiting, just pure knowledge.", icon: Zap },
              { title: "Community First", desc: "Share reviews, join reading groups, and see what's trending in your campus.", icon: Globe },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
              <Card key={i} className="group border-none shadow-none bg-transparent hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 p-8 rounded-[32px] hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-lg">{feature.desc}</p>
                </CardContent>
              </Card>
            );
            })}
          </div>
        </div>
      </section>
      <footer className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-blue-200">
              <Library className="h-6 w-6 text-white" />
            </div>
            <span className="font-display font-black text-2xl text-slate-900 tracking-tighter">Libzone</span>
          </div>
          <div className="flex gap-8 mb-10 text-slate-500 font-bold text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Careers</a>
          </div>
          <p className="text-sm text-slate-400 font-medium">© 2024 Libzone Inc. Designed for the curious minds.</p>
        </div>
      </footer>
    </div>
  );
}
