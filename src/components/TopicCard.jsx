import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, GitPullRequest, MessageSquare, ChevronDown, 
  ChevronUp, ShieldCheck, Scale, AlertTriangle, Sparkles, Coins, ThumbsUp, ThumbsDown 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateVoiceCreditCost } from '../utils/quadraticVoting';

export function TopicCard({ 
  topic, 
  userVotes, 
  onVote, 
  onOpenDetails, 
  onOpenDiscussion,
  onOpenAmendmentDiff,
  userAvailableCredits,
  onFinalizeTopic,
  onVoteSubTopic
}) {
  const [showSubTopics, setShowSubTopics] = useState(false);
  const currentVoteCount = userVotes[topic.id] || 0;
  const nextVoteCost = calculateVoiceCreditCost(currentVoteCount + 1) - calculateVoiceCreditCost(currentVoteCount);

  const handleCastVote = (direction) => {
    const newVotes = direction === 'up' ? currentVoteCount + 1 : currentVoteCount - 1;
    if (newVotes < 0) return; // Negatif sınır (veya hayır oyu kredisi)

    const requiredCredits = calculateVoiceCreditCost(newVotes) - calculateVoiceCreditCost(currentVoteCount);
    if (direction === 'up' && requiredCredits > userAvailableCredits) {
      alert(`Yetersiz Ses Kredisi! ${newVotes}. oy için ilave ${requiredCredits} VC gerekiyor. Mevcut: ${userAvailableCredits} VC`);
      return;
    }

    onVote(topic.id, newVotes, requiredCredits);

    // Görsel kutlama efekti (Hocanın gözünü boyamak için!)
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#3B82F6', '#10B981', '#F59E0B']
    });
  };

  const isAccepted = topic.status === 'KABUL_EDILDI';
  const isVoting = topic.status === 'OYLAMADA';

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 border border-gov-border hover:border-gov-accent/50 transition-all duration-300 shadow-lg relative overflow-hidden group">
      
      {/* Arka plan yumuşak neon parıltı */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-gov-accent/10 blur-3xl pointer-events-none group-hover:bg-gov-accent/20 transition-all"></div>

      {/* Üst Bilgi: Durum Rozeti, Kategori & Ontoloji Skoru */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isAccepted ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Yürürlükteki Yönetmelik (Kabul Edildi)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Oylama Fazında ({topic.deadlineHoursLeft}s Kaldı)
            </span>
          )}

          {/* Ontoloji Uyum Rozeti (Kural 6) */}
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gov-purple/20 text-purple-300 border border-gov-purple/40 flex items-center gap-1">
            <Scale className="w-3 h-3" />
            Ontoloji Uyumu: %{topic.ontologyAudit.score}
          </span>
        </div>

        {/* Yazar Bilgisi (Kural 3 - ZKP Doğrulanmış Takma Ad) */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <span className="font-semibold text-slate-200">{topic.author}</span>
          <ShieldCheck className="w-3 h-3 text-emerald-400" title={topic.authorZkpBadge} />
        </div>
      </div>

      {/* Başlık ve Metin Özeti */}
      <h3 
        onClick={() => onOpenDetails(topic)}
        className="text-base sm:text-lg font-bold text-white mb-2 cursor-pointer hover:text-gov-cyan transition-colors leading-snug"
      >
        {topic.title}
      </h3>
      
      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
        {topic.content}
      </p>

      {/* Kural 1: Düzenleme Teklifi (Amendment) Varsa Şerit */}
      {topic.hasAmendment && (
        <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-gov-card to-gov-border/40 border border-gov-cyan/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-gov-cyan flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-gov-cyan">Düzenleme Teklifi (Diff): </span>
              <span className="text-slate-300">{topic.amendment.title}</span>
            </div>
          </div>
          <button
            onClick={() => onOpenAmendmentDiff(topic)}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gov-cyan/20 hover:bg-gov-cyan/30 text-gov-cyan border border-gov-cyan/40 transition whitespace-nowrap"
          >
            Farkı Gör (Diff)
          </button>
        </div>
      )}

      {/* Kural 2: Oylama Durumu ve Nisap (Quorum) İlerleme Çubuğu */}
      <div className="mb-4 bg-gov-card/60 p-3 rounded-xl border border-gov-border/60">
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-slate-300 flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            Evet: <b className="text-white font-mono">{topic.voting.yesVotes}</b> (%{topic.voting.approvalPercentage})
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
            Hayır: <b className="text-white font-mono">{topic.voting.noVotes}</b>
          </span>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex relative">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
            style={{ width: `${topic.voting.approvalPercentage}%` }}
          />
          {/* Nisap Barajı Çizgisi (%50 Salt Çoğunluk Eşiği) */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10" 
            style={{ left: '50%' }}
            title="Salt Çoğunluk Eşiği (%50)"
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
          <span>Katılım: {topic.voting.totalParticipants} Kişi</span>
          <span className="text-emerald-400 font-semibold">
            ✓ Nisap Şartı Sağlandı (Min: {topic.voting.quorumRequired})
          </span>
        </div>
      </div>

      {/* Çoğunluk-Azınlık Koruması: Karesel Oylama (Quadratic Voting) Kutusu */}
      {isVoting && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-gov-card to-gov-card border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Karesel Oylama (Azınlık Koruma Motoru)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verilen Oy: <b className="text-white">{currentVoteCount}</b> | Harcanan Ses Kredisi: <b className="text-amber-300">{calculateVoiceCreditCost(currentVoteCount)} VC</b>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCastVote('down')}
              disabled={currentVoteCount <= 0}
              className="w-8 h-8 rounded-lg bg-gov-border hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-200 font-bold transition active:scale-95"
            >
              -
            </button>
            <span className="font-mono font-bold text-sm w-6 text-center text-white">
              {currentVoteCount}
            </span>
            <button
              onClick={() => handleCastVote('up')}
              className="px-3 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gov-dark font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
            >
              +1 Oy
              <span className="text-[10px] opacity-80">({nextVoteCost} VC)</span>
            </button>
          </div>
        </div>
      )}

      {/* Kural 5: Alt Konular (Sub-topics) Açılır Bölümü */}
      {topic.subTopics && topic.subTopics.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowSubTopics(!showSubTopics)}
            className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-gov-card hover:bg-gov-cardHover border border-gov-border text-xs text-slate-300 transition"
          >
            <span className="font-semibold text-gov-cyan flex items-center gap-1.5">
              <span>🌿 {topic.subTopics.length} Alt Konu Teklifi</span>
              <span className="text-[10px] text-slate-400 font-normal">(Bağımsız Oylamada)</span>
            </span>
            {showSubTopics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSubTopics && (
            <div className="mt-2 space-y-2 pl-3 border-l-2 border-gov-cyan/40">
              {topic.subTopics.map((sub) => (
                <div key={sub.id} className="p-2.5 rounded-lg bg-gov-dark/80 border border-gov-border/60 text-xs">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className="font-medium text-white">{sub.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sub.status === 'KABUL_EDILDI' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {sub.status === 'KABUL_EDILDI' ? 'Kabul Edildi' : 'Oylamada'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between items-center pt-1 border-t border-gov-border/40">
                    <span>Teklif Eden: {sub.proposer}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">%{sub.approvalPercentage} Onay</span>
                      {sub.status !== 'KABUL_EDILDI' && onVoteSubTopic && (
                        <button
                          onClick={() => onVoteSubTopic(topic.id, sub.id, 'YES')}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition"
                        >
                          +1 Evet Oyu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Kural 4: Oylamayı Sonuçlandırma & Mevzuat Haline Getirme (Hoca Demo Düğmesi) */}
      {isVoting && onFinalizeTopic && (
        <div className="mb-3 pt-1 flex justify-end">
          <button
            onClick={() => onFinalizeTopic(topic.id)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-gov-purple/30 to-indigo-600/30 hover:bg-gov-purple/50 border border-purple-500/40 text-purple-300 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>⚡ Oylamayı Sonuçlandır & Yasalaştır (Demo)</span>
          </button>
        </div>
      )}

      {/* Alt Aksiyon Butonları */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-gov-border/70 text-xs">
        
        {/* Kural 7: Silinmeyen Tartışma Butonu */}
        <button
          onClick={() => onOpenDiscussion(topic)}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition py-1 px-2 rounded-lg hover:bg-gov-card"
        >
          <MessageSquare className="w-4 h-4 text-gov-accent" />
          <span>Müzakere ({topic.comments.length})</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
            Silinemez
          </span>
        </button>

        {/* Detay / Madde Görüntüle */}
        <button
          onClick={() => onOpenDetails(topic)}
          className="px-3 py-1.5 rounded-lg bg-gov-card hover:bg-gov-cardHover border border-gov-border text-slate-200 hover:text-white font-semibold transition"
        >
          Metni İncele & Ontoloji →
        </button>
      </div>

    </div>
  );
}
