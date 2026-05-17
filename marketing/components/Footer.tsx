import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <span className="text-lg font-bold text-white">RealEstateX</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-400">
          <a href="mailto:hola@realestatex.com" className="hover:text-white transition-colors">
            hola@realestatex.com
          </a>
          <span className="hidden sm:inline">·</span>
          <span>© {new Date().getFullYear()} RealEstateX</span>
        </div>
      </div>
    </footer>
  );
}
