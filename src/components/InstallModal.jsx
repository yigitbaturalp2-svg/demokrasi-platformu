import React, { useState } from 'react';
import { Smartphone, Download, QrCode, CheckCircle2, X, ExternalLink, ShieldCheck } from 'lucide-react';

export function InstallModal({ onClose, publicUrl = 'https://legal-planes-train.loca.lt', tunnelPassword = '81.213.46.54' }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(publicUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col border border-gov-cyan/50 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gov-border flex items-center justify-between bg-gov-dark/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gov-cyan to-gov-accent flex items-center justify-center text-white shadow-glow-cyan">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Telefona İndir & Kurulum Rehberi
              </h3>
              <p className="text-[11px] text-slate-400">
                PWA (Progressive Web App) Olarak Ana Ekrana Yükle
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gov-card hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gövde */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* QR Kod ile Doğrudan Telefona Açma */}
          <div className="p-4 rounded-2xl bg-gov-dark/90 border border-gov-border flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-2 rounded-xl bg-white flex-shrink-0 shadow-lg">
              <img 
                src={qrUrl} 
                alt="Mobil Uygulama QR Kodu" 
                className="w-32 h-32 sm:w-28 sm:h-28 object-contain"
              />
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode className="w-4 h-4 text-gov-cyan" />
                <span>Telefonun Kamerasıyla Okutun</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Telefonunuzun kamerasını bu QR koda tutun; uygulama linki doğrudan telefonunuzun ekranında belirecektir.
              </p>
              <div className="pt-1 text-[11px] font-mono text-gov-cyan">
                {publicUrl}
              </div>
            </div>
          </div>

          {/* KYK / Tünel Güvenlik Kodu Hatırlatması */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>⚠️ Telefondan İlk Açılışta Şifre / IP Sorarsa:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Linke tıkladığınızda mavi bir ekranda <i>"Tunnel Password"</i> veya <i>"Click Submit to continue"</i> alanı gelirse, kutuya bu IP şifresini yazıp <b>Submit</b> deyin:
            </p>
            <div className="p-2 rounded-xl bg-gov-dark border border-amber-500/40 text-center font-mono font-extrabold text-sm text-amber-400 select-all">
              {tunnelPassword}
            </div>
          </div>

          {/* Telefona Kalıcı Uygulama Olarak İndirme (App Store / Play Store Gibi) */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-gov-emerald" />
              <span>Telefonun Ana Ekranına İndirme (Yükleme) Adımları:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Android */}
              <div className="p-3 rounded-xl bg-gov-card border border-gov-border space-y-1">
                <div className="font-bold text-emerald-400">🤖 Android (Chrome):</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  1. Sağ üstteki <b>⋮ (üç nokta)</b> menüsüne dokunun.<br/>
                  2. <b>"Uygulamayı Yükle"</b> veya <b>"Ana Ekrana Ekle"</b> seçin.<br/>
                  3. Telefonun menüsüne 🏛️ simgesiyle gerçek bir uygulama gibi iner!
                </p>
              </div>

              {/* iPhone iOS */}
              <div className="p-3 rounded-xl bg-gov-card border border-gov-border space-y-1">
                <div className="font-bold text-cyan-400">🍎 iPhone (Safari):</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  1. Ekranın altındaki <b>Paylaş (kare ve yukarı ok)</b> butonuna dokunun.<br/>
                  2. Aşağı kaydırıp <b>"Ana Ekrana Ekle"</b> deyin.<br/>
                  3. Uygulama tıpkı App Store'dan inmiş gibi tam ekran çalışır.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gov-border bg-gov-dark/80 flex items-center justify-between">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-gov-cyan hover:underline"
          >
            <span>Tarayıcıda Yeni Sekmede Aç</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gov-accent hover:bg-blue-600 text-xs font-bold text-white transition shadow-glow-blue"
          >
            Anladım, Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
