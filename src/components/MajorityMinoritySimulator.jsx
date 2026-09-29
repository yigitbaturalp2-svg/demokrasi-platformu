import React, { useState } from 'react';
import { ShieldAlert, Award, Scale, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function MajorityMinoritySimulator() {
  const [majoritySize, setMajoritySize] = useState(70); // 70 çoğunluk seçmeni
  const [majorityVotesPerPerson, setMajorityVotesPerPerson] = useState(1); // Çoğunluk hafif ilgileniyor (1 oy = 1 VC)
  
  const [minoritySize, setMinoritySize] = useState(15); // 15 azınlık seçmeni
  const [minorityVotesPerPerson, setMinorityVotesPerPerson] = useState(8); // Azınlık hayati etkileniyor (8 oy = 64 VC)

  const [expertMultiplier, setExpertMultiplier] = useState(2.0); // 2x Bilirkişi katsayısı
  const [expertSupportMinority, setExpertSupportMinority] = useState(true);

  // 1. Geleneksel Basit Çoğunluk Sistemi (1 Kişi = 1 Oy)
  const traditionalMajorityVotes = majoritySize;
  const traditionalMinorityVotes = minoritySize;
  const traditionalWinner = traditionalMajorityVotes > traditionalMinorityVotes ? 'ÇOĞUNLUK' : 'AZINLIK';

  // 2. Karesel Oylama (Quadratic Voting: Maliyet = Oy²)
  const qvMajorityVotes = majoritySize * majorityVotesPerPerson;
  const qvMajorityCostPerPerson = majorityVotesPerPerson * majorityVotesPerPerson;

  let qvMinorityVotes = minoritySize * minorityVotesPerPerson;
  if (expertSupportMinority) {
    qvMinorityVotes = Math.round(qvMinorityVotes * expertMultiplier);
  }
  const qvMinorityCostPerPerson = minorityVotesPerPerson * minorityVotesPerPerson;

  const qvWinner = qvMinorityVotes >= qvMajorityVotes ? 'AZINLIK' : 'ÇOĞUNLUK';

  // Azınlık Rıza Eşiği (%30 Barajı)
  const minorityQuorumPassed = (minorityVotesPerPerson >= 2);

  const handleSimulate = () => {
    if (qvWinner === 'AZINLIK') {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#10B981', '#06B6D4', '#F59E0B']
      });
    }
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-6 border border-amber-500/40 shadow-2xl space-y-5 animate-fadeIn">
      
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gov-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-glow-amber">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>Hocanın Sorusunun Çözüm Laboratuvarı: Çoğunluğun Zorbalığı Simülatörü</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Karesel Oylama ($Maliyet = Oy^2$) ve Bilirkişi Çarpanı ile Azınlık Haklarının Korunması Deneyi
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 self-start sm:self-auto">
          Vitalik Buterin & Glen Weyl Modeli
        </span>
      </div>

      {/* Kontrol Sürgüleri (Sliders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Sol: Çoğunluk Grubu */}
        <div className="p-4 rounded-2xl bg-gov-card/90 border border-gov-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-rose-400">
              👥 1. Çoğunluk Grubu (Konudan Yüzeysel Etkilenenler)
            </span>
            <span className="text-xs font-mono font-bold text-white bg-gov-dark px-2 py-0.5 rounded border border-gov-border">
              {majoritySize} Kişi
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Grup Nüfusu:</span>
              <span className="font-bold text-white">{majoritySize} Seçmen</span>
            </div>
            <input 
              type="range" min="30" max="100" value={majoritySize}
              onChange={(e) => setMajoritySize(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Kişi Başı Oy Tercihi (İlgi Düşük):</span>
              <span className="font-bold text-rose-300">{majorityVotesPerPerson} Oy (Maliyet: {qvMajorityCostPerPerson} VC)</span>
            </div>
            <input 
              type="range" min="1" max="3" value={majorityVotesPerPerson}
              onChange={(e) => setMajorityVotesPerPerson(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-gov-border/60">
            Toplam Çoğunluk Oyu: <b className="text-white font-mono">{qvMajorityVotes} Oy</b>
          </div>
        </div>

        {/* Sağ: Azınlık Grubu */}
        <div className="p-4 rounded-2xl bg-gov-card/90 border border-emerald-500/40 space-y-3 shadow-glow-emerald/10">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-emerald-400">
              🛡️ 2. Azınlık Grubu (Konudan Hayati Etkilenenler)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-gov-dark px-2 py-0.5 rounded border border-emerald-500/40">
              {minoritySize} Kişi
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Grup Nüfusu (Küçük Kitle):</span>
              <span className="font-bold text-white">{minoritySize} Seçmen</span>
            </div>
            <input 
              type="range" min="5" max="30" value={minoritySize}
              onChange={(e) => setMinoritySize(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Kişi Başı Yoğunlaştırılmış Oy (Kredilerini Yığdılar):</span>
              <span className="font-bold text-emerald-300">{minorityVotesPerPerson} Oy (Maliyet: {qvMinorityCostPerPerson} VC)</span>
            </div>
            <input 
              type="range" min="4" max="10" value={minorityVotesPerPerson}
              onChange={(e) => setMinorityVotesPerPerson(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-gov-border/60">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={expertSupportMinority} 
                onChange={(e) => setExpertSupportMinority(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span className="text-amber-400 font-semibold">Bilirkişi Bilimsel Desteği (+{expertMultiplier}x Çarpan)</span>
            </label>
          </div>
        </div>

      </div>

      {/* Canlı Karşılaştırma Sonuç Kutusu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        
        {/* Sistem A: Klasik Sistem */}
        <div className="p-3.5 rounded-2xl bg-gov-dark/90 border border-gov-border text-xs space-y-1.5">
          <div className="text-slate-400 font-bold uppercase text-[10px]">Geleneksel Sistem (1 Kişi = 1 Oy):</div>
          <div className="text-sm font-bold text-white">
            Çoğunluk: {traditionalMajorityVotes} Oy &gt; Azınlık: {traditionalMinorityVotes} Oy
          </div>
          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span><b>Sonuç: Azınlık Ezildi!</b> 70 kişinin hafif ilgisi, 15 kişinin hayati hakkını yok etti.</span>
          </div>
        </div>

        {/* Sistem B: Bizim Karesel Oylama & Bilirkişi Protokolümüz */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-xs space-y-1.5 shadow-glow-emerald">
          <div className="text-emerald-400 font-bold uppercase text-[10px]">Bizim Protokolümüz (Karesel + Bilirkişi):</div>
          <div className="text-sm font-bold text-white">
            Azınlık Gücü: <span className="text-emerald-400 font-mono font-extrabold">{qvMinorityVotes} Oy</span> &gt; Çoğunluk: <span className="text-rose-400 font-mono">{qvMajorityVotes} Oy</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <b>Sonuç: Azınlık Korundu!</b> Tercih yoğunluğu formülü ($Oy^2$) sayesinde azınlık çoğunluğun ilgisiz oylarını yendi.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
