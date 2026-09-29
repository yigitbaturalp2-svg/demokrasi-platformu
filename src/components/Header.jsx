import React, { useState } from 'react';
import { ShieldCheck, Coins, Database, PlusCircle, UserCheck, ChevronDown, CheckCircle2, Sparkles } from 'lucide-react';

export function Header({ activeUser, onOpenCreate, onOpenAI, blockHeight, onOpenKYC, onOpenInstall }) {
  const [showIdentityTooltip, setShowIdentityTooltip] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gov-dark/90 backdrop-blur-md border-b border-gov-border px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Sol: Logo ve Sistem Başlığı */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-gov-accent via-gov-cyan to-gov-emerald flex items-center justify-center shadow-glow-blue flex-shrink-0">
            <span className="text-xl sm:text-2xl font-black text-white">🏛️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                DEMOKRASİ & YÖNETİŞİM
              </h1>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-gov-accent/20 text-gov-cyan border border-gov-accent/40">
                ONTOLOJİ v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Dağıtık Defter & Bilirkişi & Karesel Konsensüs Protokolü
            </p>
          </div>
        </div>

        {/* Sağ: Durum Göstergeleri, KYC Kimliği ve Aksiyonlar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dağıtık Defter Canlı Blok Sayacı */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gov-card border border-gov-border text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <Database className="w-3.5 h-3.5 text-gov-cyan" />
            <span className="font-mono font-medium text-gov-cyan">Blok #{blockHeight}</span>
          </div>

          {/* Karesel Oylama Ses Kredisi (Voice Credits) */}
          <div 
            title="Karesel Oylama Ses Krediniz (Maliyet = Oy²)"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer hover:border-amber-400 transition"
          >
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>{activeUser.publicProfile.voiceCredits - activeUser.publicProfile.spentCredits}</span>
            <span className="hidden xs:inline text-[10px] text-amber-400/80 font-normal">VC</span>
          </div>

          {/* AI Konsensüs Asistanı Butonu */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gov-purple/20 hover:bg-gov-purple/30 border border-gov-purple/40 text-purple-300 text-xs font-medium transition shadow-glow-purple"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span className="hidden sm:inline">AI Ontoloji</span>
          </button>

          {/* Telefona İndir / PWA Yükle Butonu */}
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-gov-emerald/20 to-teal-500/20 hover:bg-gov-emerald/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition shadow-glow-emerald"
          >
            <span className="text-sm">📲</span>
            <span className="hidden sm:inline">Telefona İndir</span>
          </button>

          {/* Kural 3: ZKP Doğrulanmış Kimlik / Takma Ad Düğmesi */}
          <div className="relative">
            <button
              onClick={onOpenKYC}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-gov-card hover:bg-gov-cardHover border border-gov-border text-xs transition"
            >
              <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${activeUser.publicProfile.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                ✓
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-white flex items-center gap-1">
                  <span>{activeUser.publicProfile.pseudonym}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400">KYC Doğrulandı (ZKP)</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>
          </div>

          {/* Yeni Teklif Aç Butonu (Kural 1) */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gov-accent to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold shadow-glow-blue transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Teklif Ver</span>
          </button>
        </div>

      </div>
    </header>
  );
}
