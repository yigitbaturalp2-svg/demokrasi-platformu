import React, { useState } from 'react';
import { Sparkles, X, Brain, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function AICopilotModal({ onClose, topics }) {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSynthesis, setGeneratedSynthesis] = useState(null);

  const handleGenerateSynthesis = () => {
    setIsGenerating(true);
    setGeneratedSynthesis(null);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSynthesis({
        polarizationScore: '%72 Kutuplaşma Tespit Edildi',
        majorityArgument: 'Çoğunluk, parkların ticari yapılara kapatılmasını ve mutlak yeşil alan olarak kalmasını savunuyor.',
        minorityArgument: 'Bölge esnafı ve kafeler ise gelir kaybından ve belediyenin vergi gelirlerinin düşmesinden endişeli.',
        aiConsensusProposal: 'Madde 2.A (Uzlaşma Hükmü): Park sınırları içerisinde betonarme ve kalıcı ticari yapı inşa edilemez; ancak kentsel peyzaja uyumlu, tekerlekli, taşınabilir ve gelirinin %30\'u park bakım fonuna aktarılan eko-büfeler sınırlı sayıda işletilebilir.',
        fairnessScore: 94
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gov-purple/50 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gov-border flex items-center justify-between bg-gov-dark/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gov-purple/20 border border-gov-purple/40 flex items-center justify-center text-purple-300 shadow-glow-purple">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Yapay Zeka Müzakereci Konsensüs Asistanı (GovAI)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Çoğunluk-Azınlık Kutuplaşmasını Önleyen Uzlaşma Sentezleyicisi
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

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Açıklama */}
          <div className="p-3.5 rounded-2xl bg-gov-purple/10 border border-gov-purple/30 text-xs text-purple-200 flex items-start gap-2.5">
            <Brain className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-400" />
            <div>
              <b>Hocanın Sorusuna Yapay Zeka Çözümü:</b> Basit oylamalarda %51 çoğunluk %49 azınlığı ezer. Yapay zeka motorumuz tartışmadaki tüm karşıt argümanları tarar ve her iki tarafın kabul edebileceği <b>"Uzlaşma Değişikliği (Compromise Amendment)"</b> formüle eder.
            </div>
          </div>

          {/* Konu Seçimi */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Analiz Edilecek Müzakere Konusu:
            </label>
            <select
              value={selectedTopic.id}
              onChange={(e) => {
                const found = topics.find(t => t.id === e.target.value);
                setSelectedTopic(found);
                setGeneratedSynthesis(null);
              }}
              className="w-full px-3 py-2 rounded-xl bg-gov-card border border-gov-border text-xs text-white focus:outline-none focus:border-gov-purple"
            >
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Aksiyon Butonu */}
          <button
            onClick={handleGenerateSynthesis}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gov-purple via-indigo-600 to-gov-accent hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-glow-purple transition active:scale-98 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>{isGenerating ? 'Yapay Zeka Müzakereleri Sentezliyor...' : '⚡ Müzakereyi Tara ve Azınlık-Çoğunluk Uzlaşma Metni Üret'}</span>
          </button>

          {/* Sentez Sonucu */}
          {generatedSynthesis && (
            <div className="p-4 rounded-2xl bg-gov-dark/95 border border-gov-purple/50 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gov-border pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Yapay Zeka Uzlaşma Raporu
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                  Adalet Skoru: %{generatedSynthesis.fairnessScore}
                </span>
              </div>

              {/* Kutuplaşma Analizi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-gov-card border border-gov-border">
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">Çoğunluğun Tezleri:</div>
                  <p className="text-slate-300 text-[11px] leading-snug">{generatedSynthesis.majorityArgument}</p>
                </div>

                <div className="p-3 rounded-xl bg-gov-card border border-gov-border">
                  <div className="text-[10px] text-amber-400 font-bold mb-1">Azınlığın İtirazları:</div>
                  <p className="text-slate-300 text-[11px] leading-snug">{generatedSynthesis.minorityArgument}</p>
                </div>
              </div>

              {/* Üretilen Uzlaşma Hükmü */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-gov-cyan flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Yapay Zeka Tarafından Formüle Edilen Uzlaşma Değişikliği (Amendment):
                </div>
                <div className="p-3.5 rounded-xl bg-gov-cyan/10 border border-gov-cyan/30 text-xs sm:text-sm text-cyan-100 font-medium leading-relaxed">
                  "{generatedSynthesis.aiConsensusProposal}"
                </div>
              </div>

              <div className="text-[10px] text-slate-400 italic">
                * Bu metin oylama kilitlendiğinde meclise "Alternatif 3. Yol" olarak sunulabilir.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gov-border bg-gov-dark/80 flex justify-end">
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
