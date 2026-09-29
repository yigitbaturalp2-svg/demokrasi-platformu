import React, { useState } from 'react';
import { 
  X, MessageSquare, Send, ShieldAlert, CheckCircle, AlertTriangle, 
  Lock, Vote, ThumbsUp, ThumbsDown, Info 
} from 'lucide-react';
import { generateShortHash } from '../utils/cryptoSim';

export function DiscussionArea({ 
  topic, 
  onClose, 
  activeUser, 
  onAddComment, 
  onStartRedactionVote, 
  onCastRedactionVote 
}) {
  const [commentText, setCommentText] = useState('');
  const [selectedCommentForRedaction, setSelectedCommentForRedaction] = useState(null);
  const [redactionReason, setRedactionReason] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: 'com-' + Date.now(),
      author: activeUser.publicProfile.pseudonym,
      text: commentText.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      blockHash: generateShortHash('0x'),
      isUnderRedactionVote: false,
      redactionVotes: { yes: 0, no: 0, requiredThreshold: 0.66 }
    };

    onAddComment(topic.id, newComment);
    setCommentText('');
  };

  const handleInitiateRedaction = (comment) => {
    setSelectedCommentForRedaction(comment);
  };

  const confirmRedactionVote = () => {
    if (!redactionReason.trim()) {
      alert('Lütfen silme/sansürleme gerekçesini belirtin (örn: KVKK İhlali, Hakaret, Nefret Söylemi).');
      return;
    }

    onStartRedactionVote(topic.id, selectedCommentForRedaction.id, redactionReason);
    setSelectedCommentForRedaction(null);
    setRedactionReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gov-cyan/40 shadow-2xl overflow-hidden">
        
        {/* Modal Başlığı */}
        <div className="p-4 sm:p-5 border-b border-gov-border flex items-center justify-between bg-gov-dark/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gov-accent/20 border border-gov-accent/40 flex items-center justify-center text-gov-cyan">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>Değiştirilemez Müzakere Defteri</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  SHA-256 Mühürlü
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                {topic.title}
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

        {/* Bilgilendirme Kutusu: Kural 7 & 8 */}
        <div className="px-4 py-2.5 bg-gov-accent/10 border-b border-gov-accent/20 text-[11px] text-gov-cyan flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <b>Kural 7 & 8 İlkesi:</b> Bu tartışma alanına yazılan hiçbir mesaj yazar tarafından sonradan <u>silinemez veya değiştirilemez</u>. İhlal içeren bir yorumun gizlenmesi ancak <b>Topluluk Silme Oylaması (%66 onay)</b> ile mümkündür.
          </span>
        </div>

        {/* Yorumlar Listesi (Kronolojik Defter) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {topic.comments.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Henüz bir müzakere kaydı girilmedi. İlk görüşü siz yazın.
            </div>
          ) : (
            topic.comments.map((comment) => {
              const isUnderVote = comment.isUnderRedactionVote;
              const redaction = comment.redactionVotes || {};
              const isRedacted = redaction.isRedacted || (redaction.deleteVotes / (redaction.total || 1) >= 0.66 && redaction.total >= 5);

              return (
                <div 
                  key={comment.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isUnderVote 
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-gov-card/80 border-gov-border/80 hover:border-gov-border'
                  }`}
                >
                  {/* Yazar Bilgisi ve Blokzincir Hash'i */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                      <span>{comment.author}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({comment.timestamp})</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-mono text-gov-cyan/80 bg-gov-dark/80 px-2 py-0.5 rounded border border-gov-border">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Tx: {comment.blockHash}</span>
                    </div>
                  </div>

                  {/* Kural 8: Yorum Silinmiş / Maskelenmişse */}
                  {isRedacted ? (
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/40 text-xs text-rose-300/90 italic flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <div>
                        <b>[Halk Kararıyla Maskelenmiş İçerik]:</b> Bu yorum, topluluk oylaması sonucu %{redaction.percentage || 88} konsensüs ile sansürlenmiştir. 
                        <span className="block text-[10px] text-slate-400 not-italic font-mono mt-0.5">
                          Orijinal Defter Hash'i ({comment.blockHash}) silinmemiş olup zincirde saklanmaktadır.
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Normal Yorum Metni */
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2.5">
                      {comment.text}
                    </p>
                  )}

                  {/* Kural 8: Yorum Silme Oylamasında İse Açılan Karantina Kutusu */}
                  {isUnderVote && !isRedacted && (
                    <div className="mt-2.5 p-3 rounded-xl bg-gov-dark/90 border border-amber-500/50 space-y-2">
                      <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Topluluk Silme Oylaması (Karantina)
                        </span>
                        <span className="text-[10px] font-normal text-slate-400">Gereken Eşik: %66</span>
                      </div>

                      <p className="text-[11px] text-slate-300">
                        <b>Şikayet Gerekçesi:</b> {comment.redactionReason || 'Nefret Söylemi / KVKK İhlali'}
                      </p>

                      {/* Oy İlerleme Çubuğu */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Silinsin: {redaction.deleteVotes || 0}</span>
                          <span>Kalsın: {redaction.keepVotes || 0}</span>
                          <span className="text-amber-400 font-mono">
                            %{redaction.percentage || Math.round(((redaction.deleteVotes || 0) / ((redaction.deleteVotes || 0) + (redaction.keepVotes || 1))) * 100)} Silinme Oranı
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-rose-500 h-full" 
                            style={{ width: `${redaction.percentage || 70}%` }}
                          />
                        </div>
                      </div>

                      {/* Oy Verme Butonları */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => onCastRedactionVote(topic.id, comment.id, 'DELETE')}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center gap-1 transition"
                        >
                          <ThumbsUp className="w-3 h-3" /> Silinsin Oyu Ver
                        </button>
                        <button
                          onClick={() => onCastRedactionVote(topic.id, comment.id, 'KEEP')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-gov-border text-[11px] font-medium flex items-center gap-1 transition"
                        >
                          <ThumbsDown className="w-3 h-3" /> Kalsın Oyu Ver
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Kural 8: Silme Oylaması Başlatma Butonu (Normal Yorumlarda) */}
                  {!isUnderVote && !isRedacted && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleInitiateRedaction(comment)}
                        className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
                      >
                        <Vote className="w-3 h-3" />
                        <span>Yorum Silme / Sansür Oylaması Başlat</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Kural 8: Silme Oylaması Başlatma Giriş Alanı (Modal İçi Açılır Form) */}
        {selectedCommentForRedaction && (
          <div className="p-3 bg-amber-500/10 border-t border-amber-500/30 flex flex-col gap-2 animate-fadeIn">
            <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
              <span>⚠️ Bu Yorum İçin Topluluk Silme Oylaması Başlatılıyor:</span>
              <button 
                onClick={() => setSelectedCommentForRedaction(null)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Vazgeç
              </button>
            </div>
            <input
              type="text"
              placeholder="Silme gerekçesini girin (örn: KVKK ihlali, küfür, hakaret)..."
              value={redactionReason}
              onChange={(e) => setRedactionReason(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-gov-dark border border-amber-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={confirmRedactionVote}
              className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-gov-dark font-bold text-xs shadow transition active:scale-98"
            >
              Silme Oylamasını Dağıtık Deftere Başlat
            </button>
          </div>
        )}

        {/* Alt Form: Yeni Mesaj Ekleme (Kural 7) */}
        <form onSubmit={handleSubmitComment} className="p-3 sm:p-4 border-t border-gov-border bg-gov-dark/90 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Müzakereye silinemez bir argüman ekleyin..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-gov-card border border-gov-border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gov-accent transition"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gov-accent to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-blue transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mühürle</span>
          </button>
        </form>

      </div>
    </div>
  );
}
