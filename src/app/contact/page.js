import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Meet the Founder</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Libzone is built with care by <span className="text-slate-900 font-bold">Gursewak Singh</span> to bring modern library management to campuses everywhere. Reach out for partnerships, support, or just to say hello.
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Owner & Founder</p>
                <p className="font-display font-black text-2xl text-slate-900">Gursewak Singh</p>
                <p className="text-slate-500 font-medium">Libzone</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-[40px] p-8 sm:p-10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/10 blur-[80px] rounded-full" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                  <Image src="/avatar-1.png" alt="Gursewak Singh" fill className="object-cover" sizes="(max-width: 640px) 112px, 144px" priority />
                </div>
                <div className="hidden sm:block relative w-16 h-20 rounded-lg overflow-hidden shadow-lg opacity-80">
                  <Image src="/book-1.png" alt="" fill className="object-cover" sizes="64px" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a
              href="mailto:contact@libzone.com"
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 sm:p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-display font-bold text-slate-900 text-lg">Email</p>
                <p className="text-sm text-slate-500 mt-1">contact@libzone.com</p>
              </div>
            </a>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 sm:p-8 bg-slate-50 rounded-[32px] border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-slate-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-display font-bold text-slate-900 text-lg">Support</p>
                <p className="text-sm text-slate-500 mt-1">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 sm:p-8 bg-slate-50 rounded-[32px] border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-slate-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-display font-bold text-slate-900 text-lg">Location</p>
                <p className="text-sm text-slate-500 mt-1">India · Worldwide</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 text-center space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white relative z-10">Join the movement.</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium relative z-10">
              Whether you&apos;re an administrator looking to upgrade your campus or a student ready for a better way to read, Libzone is here for you.
            </p>
            <div className="flex justify-center relative z-10">
              <Link href="/signup" className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl">
                Start for Free
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
