import React, { useState } from 'react';
import { Scale, Award, ShieldCheck, FileCheck, Sparkles, AlertCircle, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { MOCK_EXPERTS } from '../data/mockExperts';
import { LEGAL_ONTOLOGY_TREE, auditTextAgainstOntology } from '../data/mockOntology';

export function ExpertOntologyView() {
  const [activeSubTab, setActiveSubTab] = useState('EXPERTS'); // EXPERTS, ONTOLOGY, TESTER
  const [testTitle, setTestTitle] = useState('Kentsel Parklarda Gece Güvenliği ve Kısıtlamalar');
  const [testContent, setTestContent] = useState('İl genelindeki tüm park alanlarına gece 24:00 ile 06:00 arasında girişler tamamen yasaklansın ve izinsiz girenlere para cezası uygulansın.');
  const [testResult, setTestResult] = useState(null);

  const runTest = () => {
    const res = auditTextAgainstOntology(testTitle, testContent, 'Kentsel Güvenlik ve Asayiş');
    setTestResult(res);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      
      {/* Üst Sekmeler */}
      <div className="flex border-b border-gov-border bg-gov-card/60 rounded-2xl p-1.5 gap-1.5">
        <button
          onClick={() => setActiveSubTab('EXPERTS')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'EXPERTS'
              ? 'bg-gov-accent text-white shadow-glow-blue'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Bilirkişi Entegrasyonu & Raporlar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ONTOLOGY')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'ONTOLOGY'
              ? 'bg-gov-purple text-white shadow-glow-purple'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4 text-purple-300" />
          <span>Yönetmelik Ontolojisi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('TESTER')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'TESTER'
              ? 'bg-gov-cyan text-gov-dark shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Mevzuat Denetleyicisi</span>
        </button>
      </div>

      {/* 1. BİLİRKİŞİ ENTEGRASYONU SEKMESİ */}
      {activeSubTab === 'EXPERTS' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
            <Award className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <b>Bilirkişi Ağırlığı ve Çoğunluk Dengelemesi:</b> Teknik, çevresel veya hukuki yasa tekliflerinde bağımsız akademik bilirkişiler resmi teknik rapor hazırlar. Bilirkişilerin oyları $1.8\times - 2.5\times$ etki katsayısıyla ağırlıklandırılarak, konunun uzmanı olmayan kitlelerin popülist kararlar alması engellenir.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_EXPERTS.map(exp => (
              <div key={exp.id} className="glass rounded-2xl p-4 border border-gov-border hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${exp.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-sm`}>
                      ⚖️
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{exp.name}</h4>
                      <p className="text-[11px] text-slate-400">{exp.title}</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 mb-3 p-2 rounded-lg bg-gov-card border border-gov-border">
                    <div className="text-slate-400">Kurum:</div>
                    <div className="font-medium text-white">{exp.institution}</div>
                    <div className="text-amber-400 font-mono mt-1">
                      {exp.domainTag} | Katsayı: <b>{exp.weightMultiplier}x</b>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Son Teknik Mütalaaları:</div>
                    {exp.evaluations.map((ev, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-gov-dark/80 border border-gov-border/60 text-[11px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">Teknik Not: {ev.technicalScore}/10</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                            {ev.verdict}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[10px] line-clamp-3">
                          "{ev.reportSummary}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gov-border/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Kriptografik İntisap:</span>
                  <span className="font-mono text-gov-cyan">{exp.verifiedCredentialHash.slice(0, 10)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. YÖNETMELİK ONTOLOJİSİ SEKMESİ (Kural 6) */}
      {activeSubTab === 'ONTOLOGY' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-start gap-2.5">
            <Scale className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-400" />
            <div>
              <b>Kural 6 - Yönetmelik Konuları Denetlemeye Uyarlansın (Ontoloji):</b> Tüm yasa ve konu teklifleri, üst normlar hiyerarşisine (Anayasa &gt; Genel Kanunlar &gt; Yönetmelikler) bağlı anlamsal bir ontoloji grafı üzerinden denetlenir. Bir yönetmelik Anayasa'nın temel haklarına aykırı olamaz.
            </div>
          </div>

          <div className="space-y-3">
            {LEGAL_ONTOLOGY_TREE.children.map(category => (
              <div key={category.id} className="glass rounded-2xl p-4 border border-gov-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-gov-purple flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{category.name}</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gov-purple/20 text-purple-300">
                    Ağırlık: {category.weight * 100}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                  {category.articles.map(art => (
                    <div key={art.id} className="p-3 rounded-xl bg-gov-dark/70 border border-gov-border/70 text-xs space-y-1">
                      <div className="font-bold text-gov-cyan font-mono">{art.id}</div>
                      <div className="font-semibold text-white">{art.title}</div>
                      <p className="text-[11px] text-slate-400 leading-snug">{art.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AI MEVZUAT VE UYUM TEST EDİCİ (Canlı Demo Göz Boyama Aracı) */}
      {activeSubTab === 'TESTER' && (
        <div className="glass rounded-3xl p-4 sm:p-6 border border-gov-cyan/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gov-cyan animate-pulse" />
              <h3 className="font-bold text-sm sm:text-base text-white">
                Canlı Yapay Zeka & Ontoloji Denetim Laboratuvarı
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-gov-cyan/20 text-gov-cyan font-mono">
              LLM Semantic Parser
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Hocaya göstermek için buraya herhangi bir kural veya yasa metni yazın; yapay zeka ontoloji motoru anayasal çelişkileri ve yönetmelik uyum skorunu anında hesaplasın:
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Teklif Başlığı:</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gov-dark border border-gov-border text-xs text-white focus:outline-none focus:border-gov-cyan"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Mevzuat Metni:</label>
              <textarea
                rows={3}
                value={testContent}
                onChange={(e) => setTestContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gov-dark border border-gov-border text-xs text-white focus:outline-none focus:border-gov-cyan"
              />
            </div>

            <button
              onClick={runTest}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gov-cyan via-gov-accent to-blue-600 hover:from-gov-cyan hover:to-blue-700 text-gov-dark font-extrabold text-xs shadow-glow-cyan transition active:scale-98"
            >
              ⚡ Metni Yönetmelik Ontolojisinde Test Et & Raporla
            </button>
          </div>

          {/* Test Sonuç Raporu */}
          {testResult && (
            <div className="mt-4 p-4 rounded-2xl bg-gov-dark/95 border border-gov-cyan/50 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gov-border pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gov-cyan" />
                  Yapay Zeka Ontoloji Denetim Raporu
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  testResult.score >= 80 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Uyum Skoru: %{testResult.score}
                </span>
              </div>

              {testResult.warnings.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Tespit Edilen Olası Çelişkiler (Hukuki Risk):
                  </div>
                  {testResult.warnings.map((w, i) => (
                    <div key={i} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300">
                      <b>{w.rule}:</b> {w.note}
                    </div>
                  ))}
                </div>
              )}

              {testResult.matchedRules.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Desteklenen Üst Normlar:
                  </div>
                  {testResult.matchedRules.map((m, i) => (
                    <div key={i} className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
                      <b>{m.rule}:</b> {m.note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
