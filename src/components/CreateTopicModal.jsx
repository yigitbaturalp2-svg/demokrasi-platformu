import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Scale, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { auditTextAgainstOntology } from '../data/mockOntology';
import confetti from 'canvas-confetti';

export function CreateTopicModal({ onClose, activeUser, onCreateTopic }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Çevre ve Şehircilik Ontolojisi');
  const [isAmendment, setIsAmendment] = useState(false);
  const [amendmentOldText, setAmendmentOldText] = useState('');
  const [liveAudit, setLiveAudit] = useState(null);

  // Canlı Ontoloji Denetimi (Kullanıcı yazdıkça çalışır - Göz boyama özelliği!)
  useEffect(() => {
    if (title.length > 5 || content.length > 10) {
      const res = auditTextAgainstOntology(title, content, category);
      setLiveAudit(res);
    } else {
      setLiveAudit(null);
    }
  }, [title, content, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newTopic = {
      id: 'top-' + Date.now(),
      title: title.trim(),
      author: activeUser.publicProfile.pseudonym,
      authorZkpBadge: `${activeUser.realIdentity.district} Seçmeni (${activeUser.publicProfile.zkpBadge})`,
      status: 'OYLAMADA', // Kural 4: Doğrudan oylamaya girer
      category,
      createdAt: new Date().toISOString().slice(0, 10),
      deadlineHoursLeft: 72,
      content: content.trim(),
      hasAmendment: isAmendment,
      amendment: isAmendment ? {
        id: 'amend-' + Date.now(),
        proposer: activeUser.publicProfile.pseudonym,
        title: 'Mevcut Madde Düzenleme Teklifi',
        oldText: amendmentOldText || 'Eski kanun maddesi metni...',
        proposedText: content.trim(),
        votesYes: 1,
        votesNo: 0,
        status: 'OYLAMADA'
      } : null,
      voting: {
        yesVotes: 1,
        noVotes: 0,
        totalParticipants: 1,
        quorumRequired: 200,
        isQuorumMet: false,
        approvalPercentage: 100,
        quadraticCreditsSpent: 1,
        minorityProtectionActive: true
      },
      subTopics: [],
      ontologyAudit: liveAudit || {
        score: 90,
        isCompliant: true,
        legalMatches: ['Belediye Kanunu Md. 14'],
        aiSummary: 'Mevzuat ontolojisine uygun olarak oylamaya sunulmuştur.'
      },
      comments: [
        {
          id: 'com-init-' + Date.now(),
          author: activeUser.publicProfile.pseudonym,
          text: 'Teklif meclis ve yurttaş müzakeresine açılmıştır. Görüşlerinizi silinemez deftere yazabilirsiniz.',
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          blockHash: '0x' + Math.random().toString(16).slice(2, 10),
          isUnderRedactionVote: false,
          redactionVotes: { yes: 0, no: 0, requiredThreshold: 0.66 }
        }
      ]
    };

    onCreateTopic(newTopic);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gov-accent/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gov-border flex items-center justify-between bg-gov-dark/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gov-accent/20 border border-gov-accent/40 flex items-center justify-center text-gov-cyan">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Yeni Yasa / Konu veya Düzenleme Teklifi Ver
              </h3>
              <p className="text-[11px] text-slate-400">
                Kural 1 & 4: Teklif doğrudan oylamaya girecek ve çoğunlukla kabul edilecektir.
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

        {/* Form Gövdesi */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Teklif Tipi Seçimi (Yeni Konu vs Düzenleme Teklifi) */}
          <div className="flex gap-2 p-1 bg-gov-dark rounded-xl border border-gov-border">
            <button
              type="button"
              onClick={() => setIsAmendment(false)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                !isAmendment ? 'bg-gov-accent text-white shadow-glow-blue' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ Sıfırdan Yeni Konu Aç
            </button>
            <button
              type="button"
              onClick={() => setIsAmendment(true)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                isAmendment ? 'bg-gov-cyan text-gov-dark shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Düzenleme Teklifi (Amendment/Diff)
            </button>
          </div>

          {/* Kategori / Ontoloji Kümesi */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Hukuk ve Yönetmelik Ontolojisi Alanı:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gov-card border border-gov-border text-xs text-white focus:outline-none focus:border-gov-accent"
            >
              <option value="Çevre ve Şehircilik Ontolojisi">Çevre ve Şehircilik Ontolojisi (AY-56 & Çevre K.)</option>
              <option value="Ulaşım ve Sosyal Haklar Ontolojisi">Ulaşım ve Sosyal Haklar Ontolojisi (Belediye K. Md. 15)</option>
              <option value="Bütçe ve Mali Disiplin Ontolojisi">Bütçe ve Mali Disiplin Ontolojisi (Kamu Mali Yönetimi K.)</option>
              <option value="Temel Haklar ve İfade Özgürlüğü">Temel Haklar ve İfade Özgürlüğü (AY-10 & AY-13)</option>
            </select>
          </div>

          {/* Başlık */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {isAmendment ? 'Düzenleme Teklifi Başlığı:' : 'Yasa / Yönetmelik Konusu Başlığı:'}
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Kentsel Park Alanlarında Biyolojik Çeşitliliğin Korunması..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gov-card border border-gov-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gov-accent"
            />
          </div>

          {/* Düzenleme ise: Eski Metin */}
          {isAmendment && (
            <div>
              <label className="text-xs font-semibold text-rose-400 block mb-1">
                Değiştirilmesi İstenen Eski Metin (Silinecek Hüküm):
              </label>
              <textarea
                rows={2}
                placeholder="Örn: Park alanlarında ticari büfe açılması serbesttir..."
                value={amendmentOldText}
                onChange={(e) => setAmendmentOldText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 placeholder-rose-300/40 focus:outline-none focus:border-rose-400"
              />
            </div>
          )}

          {/* Konu Metni */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {isAmendment ? 'Teklif Edilen Yeni Hüküm (Diff Yeşil Kısım):' : 'Konu ve Yönetmelik Gerekçe Metni:'}
            </label>
            <textarea
              rows={4}
              required
              placeholder="Hukuki dayanaklar, kamu yararı ve getirilmek istenen kuralı detaylandırın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gov-card border border-gov-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gov-accent"
            />
          </div>

          {/* Canlı AI Ontoloji Denetim Şeridi (Göz Boyama!) */}
          {liveAudit && (
            <div className="p-3.5 rounded-2xl bg-gov-purple/15 border border-gov-purple/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  Canlı Yapay Zeka Ontoloji Denetimi
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Uyum: %{liveAudit.score}
                </span>
              </div>

              <div className="text-[11px] text-slate-300">
                {liveAudit.matchedRules.length > 0 && (
                  <span className="text-emerald-400 font-medium">
                    ✓ Eşleşen Üst Norm: {liveAudit.matchedRules[0].rule} ({liveAudit.matchedRules[0].note})
                  </span>
                )}
                {liveAudit.warnings.length > 0 && (
                  <span className="text-amber-400 font-medium block mt-1">
                    ⚠️ Dikkat: {liveAudit.warnings[0].note}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* İmzalayan KYC Kimliği */}
          <div className="p-3 rounded-xl bg-gov-dark/80 border border-gov-border text-xs flex justify-between items-center text-slate-400">
            <div>
              İmzalayan DID: <b className="text-white">{activeUser.publicProfile.pseudonym}</b>
            </div>
            <div className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Doğrulanmış Nüfus
            </div>
          </div>

          {/* Gönder Butonu */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-gov-accent via-blue-600 to-gov-cyan hover:from-blue-600 hover:to-cyan-600 text-white font-extrabold text-sm shadow-glow-blue transition active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Teklifi Dağıtık Deftere Mühürle ve Oylamaya Aç</span>
              <span>→</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
