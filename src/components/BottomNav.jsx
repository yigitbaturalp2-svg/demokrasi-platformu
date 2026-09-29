import React from 'react';
import { Vote, Network, Scale, Blocks, UserCheck } from 'lucide-react';

export function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'topics', label: 'Konular', icon: Vote, badge: 'Aktif' },
    { id: 'graph', label: 'İnsan Grafı', icon: Network, badge: 'Web of Trust' },
    { id: 'ontology', label: 'Bilirkişi & AI', icon: Scale, badge: 'Ontoloji' },
    { id: 'ledger', label: 'Defter', icon: Blocks, badge: 'Zincir' },
    { id: 'kyc', label: 'Kimlik / KYC', icon: UserCheck, badge: 'ZKP' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gov-dark/95 backdrop-blur-xl border-t border-gov-border px-2 py-1.5 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-gov-cyan font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-gov-cyan to-gov-accent shadow-glow-cyan" />
              )}
              <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
