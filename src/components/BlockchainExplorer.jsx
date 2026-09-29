import React, { useState } from 'react';
import { Blocks, Database, CheckCircle2, Cpu, ArrowDown, Search, Lock, ShieldCheck, Play } from 'lucide-react';

export function BlockchainExplorer({ blockchain, onMineNewBlock }) {
  const [selectedBlock, setSelectedBlock] = useState(blockchain[blockchain.length - 1]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlocks = blockchain.filter(b => 
    b.index.toString().includes(searchTerm) || 
    b.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      
      {/* Üst Bilgilendirme ve Madencilik Butonu */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-gov-card via-gov-cardHover to-gov-card border border-emerald-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glow-emerald">
            <Blocks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Dağıtık Defter & Blok Gezgini (Blockchain Ledger)</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                Konsensüs: PoA / Raft
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Tüm oylamalar, silinemeyen müzakereler ve teklifler ardışık bloklara kriptografik olarak mühürlenmektedir.
            </p>
          </div>
        </div>

        <button
          onClick={onMineNewBlock}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-gov-dark font-extrabold text-xs shadow-glow-emerald transition active:scale-95 whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Yeni Blok Kaz (Mine Demo Block)</span>
        </button>
      </div>

      {/* Arama Çubuğu */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Blok numarası veya Hash ile ara (örn: 1046 veya 0x...)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-gov-card border border-gov-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Blok Zinciri Görünümü (Yatay ve Dikey Akış) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Sol Kolon: Blok Listesi */}
        <div className="lg:col-span-1 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Son Üretilen Bloklar ({blockchain.length}):
          </div>

          {filteredBlocks.slice().reverse().map((block, i) => {
            const isSelected = selectedBlock?.index === block.index;
            return (
              <div
                key={block.index}
                onClick={() => setSelectedBlock(block)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-glow-emerald'
                    : 'bg-gov-card hover:bg-gov-cardHover border-gov-border'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white font-mono flex items-center gap-1.5">
                    <Blocks className="w-3.5 h-3.5 text-emerald-400" />
                    Blok #{block.index}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(block.timestamp).toLocaleTimeString('tr-TR')}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-gov-cyan truncate mb-1">
                  Hash: {block.hash}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-gov-border/60">
                  <span>{block.transactions.length} İşlem (Tx)</span>
                  <span className="text-emerald-400">✓ Onaylandı</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sağ Kolon: Seçili Blok Detayı */}
        {selectedBlock && (
          <div className="lg:col-span-2 glass rounded-3xl p-5 border border-gov-border space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  BLOK YÜKSEKLİĞİ #{selectedBlock.index}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Kriptografik Blok Başlığı ve Merkle Ağacı
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                Nonce: {selectedBlock.nonce}
              </span>
            </div>

            {/* Hash Bilgileri */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-gov-dark/80 border border-gov-border font-mono space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Blok SHA-256 Hash'i:</div>
                <div className="text-gov-cyan break-all font-semibold">{selectedBlock.fullHash || selectedBlock.hash}</div>
              </div>

              <div className="p-3 rounded-xl bg-gov-dark/80 border border-gov-border font-mono space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Önceki Blok Hash'i (PrevHash):</div>
                <div className="text-slate-300 break-all">{selectedBlock.previousHash}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-xl bg-gov-dark/80 border border-gov-border">
                  <div className="text-[10px] text-slate-400">Merkle Root:</div>
                  <div className="text-amber-400 truncate">{selectedBlock.merkleRoot}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-gov-dark/80 border border-gov-border">
                  <div className="text-[10px] text-slate-400">Madenci Düğümü:</div>
                  <div className="text-white truncate">{selectedBlock.miner}</div>
                </div>
              </div>
            </div>

            {/* Blok İçindeki İşlemler (Transactions) */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Bloka Yazılan Değiştirilemez İşlemler ({selectedBlock.transactions.length}):
              </div>

              <div className="space-y-2">
                {selectedBlock.transactions.map((tx, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gov-card/90 border border-gov-border/80 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold font-mono bg-gov-accent/20 text-gov-cyan">
                          {tx.type}
                        </span>
                        <span className="font-semibold text-white">
                          {tx.title || tx.method || tx.id}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        İmzalayan: <span className="text-slate-300">{tx.author || tx.voter || 'Anonim Yurttaş'}</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{tx.hash || tx.contentHash || '0x49f1a...'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
