import React, { useState } from 'react';
import { 
  X, CheckCircle, Clock, GitPullRequest, Scale, ShieldCheck, 
  MessageSquare, FileText, Plus, ThumbsUp, ThumbsDown 
} from 'lucide-react';

export function TopicDetailModal({ 
  topic, 
  onClose, 
  onOpenDiscussion, 
  onAddSubTopic, 
  activeUser,
  onVoteAmendment,
  onAdoptAmendment,
  onVoteSubTopic
}) {
  const [activeTab, setActiveTab] = useState('DETAILS'); // DETAILS, DIFF, SUBTOPICS
  const [newSubTopicTitle, setNewSubTopicTitle] = useState('');
  const [showAddSubTopic, setShowAddSubTopic] = useState(false);

  const handleSubTopicSubmit = (e) => {
    e.preventDefault();
    if (!newSubTopicTitle.trim()) return;

    onAddSubTopic(topic.id, {
      id: 'sub-' + Date.now(),
      title: newSubTopicTitle.trim(),
      proposer: activeUser.publicProfile.pseudonym,
      status: 'OYLAMADA',
      yesVotes: 1,
      noVotes: 0,
      approvalPercentage: 100
    });

    setNewSubTopicTitle('');
    setShowAddSubTopic(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gov-accent/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gov-border flex items-center justify-between bg-gov-dark/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gov-accent/20 text-gov-cyan border border-gov-accent/40">
                {topic.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {topic.id}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {topic.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gov-card hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sekmeler: Madde Metni / Diff Görünümü / Alt Konular */}
        <div className="flex border-b border-gov-border bg-gov-dark/40 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === 'DETAILS'
                ? 'border-gov-accent text-gov-cyan'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Madde & Gerekçe Metni
          </button>

          {topic.hasAmendment && (
            <button
              onClick={() => setActiveTab('DIFF')}
              className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'DIFF'
                  ? 'border-gov-cyan text-gov-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Düzenleme Teklifi (Diff)</span>
              <span className="w-2 h-2 rounded-full bg-gov-cyan animate-pulse" />
            </button>
          )}

          <button
            onClick={() => setActiveTab('SUBTOPICS')}
            className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'SUBTOPICS'
                ? 'border-gov-emerald text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Alt Konular ({topic.subTopics?.length || 0})</span>
          </button>
        </div>

        {/* Gövde */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* TAB 1: Standart Metin ve Hukuk Ontolojisi */}
          {activeTab === 'DETAILS' && (
            <>
              {/* Madde Metni */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gov-accent" />
                  Mevzuat Madde Metni
                </h4>
                <div className="p-4 rounded-2xl bg-gov-card/80 border border-gov-border text-sm text-slate-200 leading-relaxed font-sans">
                  {topic.content}
                </div>
              </div>

              {/* Kural 6: Yönetmelik Ontolojisi Denetim Paneli */}
              <div className="p-4 rounded-2xl bg-gov-purple/10 border border-gov-purple/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-purple-400" />
                    Yönetmelik Ontolojisi & Normlar Hiyerarşisi Raporu
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Uyum Skoru: %{topic.ontologyAudit.score}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {topic.ontologyAudit.aiSummary}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400">Atıf Yapılan ve Eşleşen Üst Hukuk Normları:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.ontologyAudit.legalMatches.map((law, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-gov-dark/80 text-[11px] font-mono text-gov-cyan border border-gov-border">
                        § {law}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Teklif Sahibi Bilgisi */}
              <div className="flex items-center justify-between text-xs text-slate-400 p-3 rounded-xl bg-gov-dark/60 border border-gov-border">
                <div>
                  Teklif Sahibi: <b className="text-white">{topic.author}</b>
                </div>
                <div className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {topic.authorZkpBadge}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Kural 1: Düzenleme Teklifi (Diff Görünümü) */}
          {activeTab === 'DIFF' && topic.hasAmendment && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-gov-cyan/10 border border-gov-cyan/30 text-xs text-gov-cyan flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 flex-shrink-0" />
                <span>
                  <b>Kural 1 - Düzenleme Teklifi (Amendment):</b> Bu teklif, kabul edilen ana konunun belirli bir cümlesini değiştirmek için sunulmuştur. Değişiklik kabul edilirse ana metin güncellenecektir.
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span>- Yürürlükteki / Mevcut Metin (Eski)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-200 line-through">
                  {topic.amendment.oldText}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>+ Teklif Edilen Düzenleme Metni (Yeni)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200">
                  {topic.amendment.proposedText}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gov-card border border-gov-border flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Teklif Eden: <b className="text-white">{topic.amendment.proposer}</b></span>
                  <div className="text-emerald-400 font-mono font-bold mt-0.5">
                    {topic.amendment.votesYes} Evet / {topic.amendment.votesNo} Hayır
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onVoteAmendment && (
                    <button
                      onClick={() => onVoteAmendment(topic.id, topic.amendment.id, 'YES')}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition active:scale-95"
                    >
                      +1 Evet Oyu Ver
                    </button>
                  )}
                  {onAdoptAmendment && (
                    <button
                      onClick={() => onAdoptAmendment(topic.id, topic.amendment.id)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-gov-cyan to-gov-accent hover:from-cyan-500 hover:to-blue-600 text-gov-dark font-extrabold text-xs transition shadow-glow-cyan active:scale-95"
                    >
                      ✓ Düzenlemeyi Kabul Et & Metne İşle
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Kural 5: Alt Konular (Sub-topics) */}
          {activeTab === 'SUBTOPICS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300">
                  Hiyerarşik Alt Konu Teklifleri
                </h4>
                <button
                  onClick={() => setShowAddSubTopic(!showAddSubTopic)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gov-emerald/20 hover:bg-gov-emerald/30 text-emerald-400 border border-gov-emerald/40 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Alt Konu Öner</span>
                </button>
              </div>

              {/* Alt Konu Ekleme Formu */}
              {showAddSubTopic && (
                <form onSubmit={handleSubTopicSubmit} className="p-3.5 rounded-2xl bg-gov-card border border-gov-border space-y-2.5">
                  <div className="text-xs font-semibold text-white">Yeni Alt Konu Başlığı Öner:</div>
                  <input
                    type="text"
                    placeholder="Örn: Gece aydınlatmalarında sensörlü LED kullanılması..."
                    value={newSubTopicTitle}
                    onChange={(e) => setNewSubTopicTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gov-dark border border-gov-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSubTopic(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={!newSubTopicTitle.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-gov-dark font-bold text-xs"
                    >
                      Oylamaya Sun
                    </button>
                  </div>
                </form>
              )}

              {/* Alt Konular Listesi */}
              <div className="space-y-2.5">
                {topic.subTopics?.map((sub) => (
                  <div key={sub.id} className="p-3.5 rounded-2xl bg-gov-card border border-gov-border flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="text-xs font-bold text-white">{sub.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Teklif Eden: {sub.proposer}</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        %{sub.approvalPercentage} Onay
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.status === 'KABUL_EDILDI' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {sub.status === 'KABUL_EDILDI' ? 'Kabul Edildi' : 'Oylamada'}
                      </span>
                      {sub.status !== 'KABUL_EDILDI' && onVoteSubTopic && (
                        <button
                          onClick={() => onVoteSubTopic(topic.id, sub.id, 'YES')}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition active:scale-95"
                        >
                          +1 Oy Ver
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Butonları */}
        <div className="p-4 border-t border-gov-border bg-gov-dark/80 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenDiscussion(topic);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gov-card hover:bg-gov-cardHover border border-gov-border text-xs text-gov-cyan font-bold transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gov-cyan" />
            <span>Müzakere Defterini Aç ({topic.comments?.length || 0})</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gov-border hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
