import React, { useState } from 'react';
import { TopicCard } from './TopicCard';
import { MajorityMinoritySimulator } from './MajorityMinoritySimulator';
import { Filter, Sparkles, Plus, AlertCircle, ShieldAlert, Scale } from 'lucide-react';

export function TopicList({ 
  topics, 
  userVotes, 
  onVote, 
  onOpenDetails, 
  onOpenDiscussion, 
  onOpenAmendmentDiff,
  onOpenCreate,
  userAvailableCredits,
  onFinalizeTopic,
  onVoteSubTopic
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredTopics = topics.filter(topic => {
    if (activeFilter === 'VOTING') return topic.status === 'OYLAMADA';
    if (activeFilter === 'ACCEPTED') return topic.status === 'KABUL_EDILDI';
    if (activeFilter === 'AMENDMENT') return topic.hasAmendment;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Üst Bilgilendirme Bannerı (Hocanın Sorusuna Doğrudan Cevap Veren Şerit) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-gov-card via-gov-cardHover to-gov-card border border-gov-accent/30 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-gov-accent/20 border border-gov-accent/40 flex items-center justify-center text-gov-cyan flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span>Çoğunluğun Zorbalığına Karşı 4 Kademeli Güvence</span>
              <span className="px-1.5 py-0.2 rounded bg-gov-emerald/20 text-emerald-300 text-[10px]">Aktif Protokol</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
              Bu platformda <b>Karesel Oylama (Quadratic Voting: $Maliyet = Oy^2$)</b>, <b>Bilirkişi Etki Çarpanı (DIF)</b> ve <b>%30 Azınlık Rıza Eşiği</b> uygulanmaktadır. Azınlıklar tercih yoğunluklarını tek bir teklife yönlendirerek çoğunluğun ilgisiz oylarını dengeleyebilir.
            </p>
          </div>
        </div>
      </div>

      {/* Filtreleme ve Hızlı İşlemler */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Filtre Butonları */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Tüm Konular' },
            { id: 'VOTING', label: '🗳️ Oylamada' },
            { id: 'ACCEPTED', label: '✓ Yürürlükte' },
            { id: 'AMENDMENT', label: '⚡ Düzenleme Teklifleri' },
            { id: 'SIMULATOR', label: '🎯 Azınlık Hakları Deneyi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-gov-accent text-white shadow-glow-blue'
                  : 'bg-gov-card hover:bg-gov-cardHover text-slate-300 border border-gov-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Yeni Konu Aç Düğmesi */}
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gov-emerald to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-xs font-bold shadow-glow-emerald transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Konu / Düzenleme Öner</span>
        </button>
      </div>

      {/* Eğer Simülatör Sekmesi Seçildiyse */}
      {activeFilter === 'SIMULATOR' ? (
        <MajorityMinoritySimulator />
      ) : (
        /* Konu Kartları Listesi */
        <div className="space-y-4">
          {filteredTopics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              userVotes={userVotes}
              onVote={onVote}
              onOpenDetails={onOpenDetails}
              onOpenDiscussion={onOpenDiscussion}
              onOpenAmendmentDiff={onOpenAmendmentDiff}
              userAvailableCredits={userAvailableCredits}
              onFinalizeTopic={onFinalizeTopic}
              onVoteSubTopic={onVoteSubTopic}
            />
          ))}
        </div>
      )}

    </div>
  );
}
