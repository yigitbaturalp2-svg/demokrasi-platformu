import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, MapPin, Calendar, CreditCard, Coins, Award, CheckCircle2, X } from 'lucide-react';
import { MOCK_CITIZENS } from '../data/mockCitizens';

export function KYCModal({ activeUser, onSwitchUser, onClose }) {
  const [selectedUser, setSelectedUser] = useState(activeUser);

  const handleSelect = (user) => {
    setSelectedUser(user);
    onSwitchUser(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col border border-emerald-500/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gov-border flex items-center justify-between bg-gov-dark/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Yurttaş Kimlik & KYC Doğrulama Katmanı</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                  Kural 3
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Resmi Nüfus/Adres Kaydı (Sistem Girişli) + Halka Açık Takma Ad (ZKP)
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gov-card hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Kural 3 Açıklama Şeridi */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
            <UserCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <b>Kural 3 İlkesi:</b> Her yurttaşın ad-soyad, TC kimlik ve ikametgah adresi sistem tarafından doğrulanır; ancak ifade özgürlüğü ve KVKK gereğince kamusal müzakere alanında <b>Sıfır Bilgi İspatlı (ZKP) Takma Ad</b> kullanılır.
            </div>
          </div>

          {/* 1. Sistem Tarafından Doğrulanmış Resmi Veriler (Gizli Katman) */}
          <div className="p-4 rounded-2xl bg-gov-card/80 border border-gov-border space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-gov-border pb-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Sistem Nüfus Kaydı (Merkezi Doğrulama)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                ✓ e-Devlet Onaylı
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Ad Soyad:</span>
                <span className="font-semibold text-white">{selectedUser.realIdentity.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">T.C. Kimlik No:</span>
                <span className="font-mono text-slate-200">{selectedUser.realIdentity.tcNo.slice(0, 3)}*****{selectedUser.realIdentity.tcNo.slice(-3)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Doğum Tarihi:</span>
                <span className="text-slate-200">{selectedUser.realIdentity.birthDate} (18+ Reşit)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Kayıtlı İkametgah İli/İlçesi:</span>
                <span className="text-emerald-400 font-semibold">{selectedUser.realIdentity.district}, {selectedUser.realIdentity.city}</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-gov-border/60">
              Kriptografik İkametgah Hash'i: {selectedUser.realIdentity.addressProofHash}
            </div>
          </div>

          {/* 2. Kamusal Takma Ad ve ZKP Rozeti */}
          <div className="p-4 rounded-2xl bg-gov-dark/90 border border-gov-cyan/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gov-cyan flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Kamusal Kimlik ve Takma Ad (ZKP Katmanı)
              </span>
              <span className="text-[10px] font-mono text-slate-400">DID: {selectedUser.id}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedUser.publicProfile.avatarColor} flex items-center justify-center text-white font-extrabold text-xl shadow-glow-blue`}>
                ✓
              </div>
              <div>
                <div className="text-base font-extrabold text-white flex items-center gap-1.5">
                  <span>{selectedUser.publicProfile.pseudonym}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {selectedUser.publicProfile.role}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedUser.publicProfile.badges.map((b, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gov-card border border-gov-border text-slate-300">
                  ✓ {b}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gov-border">
              <div className="p-2.5 rounded-xl bg-gov-card border border-gov-border">
                <div className="text-[10px] text-slate-400">Karesel Ses Kredisi:</div>
                <div className="text-amber-400 font-extrabold text-sm font-mono">
                  {selectedUser.publicProfile.voiceCredits - selectedUser.publicProfile.spentCredits} / {selectedUser.publicProfile.voiceCredits} VC
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-gov-card border border-gov-border">
                <div className="text-[10px] text-slate-400">Topluluk İtibar Puanı:</div>
                <div className="text-emerald-400 font-extrabold text-sm font-mono">
                  {selectedUser.publicProfile.reputationScore} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Test / Demo Amaçlı Kullanıcı Değiştirme */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-400">Sunumda Farklı Bir Yurttaş Profili Seç:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOCK_CITIZENS.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`p-2 rounded-xl text-left border transition text-xs ${
                    selectedUser.id === c.id
                      ? 'bg-gov-accent/20 border-gov-accent text-white shadow-glow-blue'
                      : 'bg-gov-card border-gov-border text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold truncate">{c.publicProfile.pseudonym}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.realIdentity.district}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        {onClose && (
          <div className="p-4 border-t border-gov-border bg-gov-dark/80 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gov-border hover:bg-slate-700 text-xs font-semibold text-white transition"
            >
              Tamam
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
