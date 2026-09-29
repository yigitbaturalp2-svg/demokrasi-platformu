import React, { useRef, useEffect, useState } from 'react';
import { Network, ShieldCheck, Scale, Award, Info, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { MOCK_CITIZENS } from '../data/mockCitizens';
import { MOCK_EXPERTS } from '../data/mockExperts';

export function InteractiveGraph({ topics, onSelectTopic }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // ALL, CITIZEN, EXPERT, TOPIC
  const [zoom, setZoom] = useState(1);

  // Graf Düğümleri ve Kenarları
  const graphDataRef = useRef({
    nodes: [],
    links: []
  });

  const draggingNodeRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Graf verisini hazırla
  useEffect(() => {
    const nodes = [];
    const links = [];

    // 1. Yurttaş Düğümleri (Mavi/Cyan)
    MOCK_CITIZENS.forEach((cit, i) => {
      nodes.push({
        id: cit.id,
        type: 'CITIZEN',
        label: cit.publicProfile.pseudonym,
        subLabel: cit.realIdentity.city + ' / ' + cit.realIdentity.district,
        raw: cit,
        color: '#06B6D4', // Cyan
        radius: 22,
        x: 180 + Math.cos(i * 1.5) * 140,
        y: 200 + Math.sin(i * 1.5) * 140,
        vx: 0,
        vy: 0
      });

      // Güven bağları (Web of Trust)
      cit.trustConnections.forEach(targetId => {
        links.push({
          source: cit.id,
          target: targetId,
          type: 'TRUST',
          color: 'rgba(6, 182, 212, 0.35)'
        });
      });
    });

    // 2. Bilirkişi Düğümleri (Altın/Amber)
    MOCK_EXPERTS.forEach((exp, i) => {
      nodes.push({
        id: exp.id,
        type: 'EXPERT',
        label: exp.name,
        subLabel: exp.title,
        raw: exp,
        color: '#F59E0B', // Amber
        radius: 26,
        x: 350 + Math.cos(i * 2.1) * 120,
        y: 180 + Math.sin(i * 2.1) * 120,
        vx: 0,
        vy: 0
      });
    });

    // 3. Konu Düğümleri (Mor)
    topics.forEach((top, i) => {
      nodes.push({
        id: top.id,
        type: 'TOPIC',
        label: top.title.slice(0, 20) + '...',
        subLabel: top.category,
        raw: top,
        color: '#8B5CF6', // Purple
        radius: 24,
        x: 260 + Math.cos(i * 2) * 170,
        y: 350 + Math.sin(i * 2) * 110,
        vx: 0,
        vy: 0
      });

      // Konu - Yazar ve Bilirkişi Değerlendirme Bağları
      links.push({
        source: 'cit-001',
        target: top.id,
        type: 'VOTE',
        color: 'rgba(139, 92, 246, 0.35)'
      });
    });

    // Bilirkişilerin konulara bağları
    links.push({ source: 'exp-001', target: 'top-001', type: 'EVAL', color: 'rgba(245, 158, 11, 0.4)' });
    links.push({ source: 'exp-002', target: 'top-001', type: 'EVAL', color: 'rgba(245, 158, 11, 0.4)' });
    links.push({ source: 'exp-003', target: 'top-002', type: 'EVAL', color: 'rgba(245, 158, 11, 0.4)' });

    graphDataRef.current = { nodes, links };
    setSelectedNode(nodes[0]); // İlk yurttaşı varsayılan seç
  }, [topics]);

  // Fizik motoru ve Çizim Döngüsü
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      // Çözünürlük ayarı
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const { nodes, links } = graphDataRef.current;
      const centerX = width / 2;
      const centerY = height / 2;

      // Basit Kuvvet Alanı (Force Simulation)
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        if (nodeA === draggingNodeRef.current) continue;

        // Merkeze doğru çekim kuvveti
        nodeA.vx += (centerX - nodeA.x) * 0.0008;
        nodeA.vy += (centerY - nodeA.y) * 0.0008;

        // Düğümler arası itme kuvveti
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 180) {
            const force = (180 - dist) / dist * 0.15;
            nodeA.vx -= dx * force * 0.05;
            nodeA.vy -= dy * force * 0.05;
            nodeB.vx += dx * force * 0.05;
            nodeB.vy += dy * force * 0.05;
          }
        }

        // Hız sönümleme
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;
        nodeA.vx *= 0.88;
        nodeA.vy *= 0.88;
      }

      // 1. Kenarları (Bağlantı Çizgilerini) Çiz
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = link.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Parçacık parıltısı (Canlı ağ hissi)
        const t = (Date.now() % 3000) / 3000;
        const px = sourceNode.x + (targetNode.x - sourceNode.x) * t;
        const py = sourceNode.y + (targetNode.y - sourceNode.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      });

      // 2. Düğümleri (Nodes) Çiz
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;

        // Düğüm Dış Hale / Parıltı
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isSelected ? 8 : 4), 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.05)';
        ctx.fill();

        // Düğüm Gövdesi
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // İkon veya Kısaltma Harfi
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillStyle = '#080C14';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const glyph = node.type === 'CITIZEN' ? '👤' : (node.type === 'EXPERT' ? '⚖️' : '📜');
        ctx.fillText(glyph, node.x, node.y);

        // Düğüm Başlığı (Etiket)
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#94A3B8';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedNode]);

  // Dokunma / Fare Olayları (Sürükleme ve Seçme)
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e) => {
    const { x, y } = getCanvasCoords(e);
    const { nodes } = graphDataRef.current;

    for (const node of nodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= node.radius + 6) {
        draggingNodeRef.current = node;
        setSelectedNode(node);
        break;
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!draggingNodeRef.current) return;
    const { x, y } = getCanvasCoords(e);
    draggingNodeRef.current.x = x;
    draggingNodeRef.current.y = y;
  };

  const handlePointerUp = () => {
    draggingNodeRef.current = null;
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Üst Bilgi Kartı: "İnsanları Grafta Tut" Kuralı */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-gov-card to-gov-cardHover border border-gov-cyan/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gov-cyan/20 border border-gov-cyan/40 flex items-center justify-center text-gov-cyan shadow-glow-cyan">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>İnteraktif Yurttaş & Güven Grafı (Web of Trust)</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                Canlı Düğümler
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Hocanın <i>"İnsanları grafta tut"</i> kuralı: Yurttaşlar, bilirkişiler ve mevzuat arasındaki güven ve oylama ağını temsil eder. Düğümlere dokunarak sürükleyin!
            </p>
          </div>
        </div>

        {/* Gösterge Renkleri */}
        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <span className="flex items-center gap-1 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Yurttaşlar
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Bilirkişiler
          </span>
          <span className="flex items-center gap-1 text-purple-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Konular
          </span>
        </div>
      </div>

      {/* Ana Canvas Alanı ve Dokunmatik Arayüz */}
      <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl bg-gov-dark/95 border border-gov-border overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Seçili Düğüm İnceleme Kartı (Floating Detail Overlay) */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 p-3.5 rounded-2xl glass-modal border border-gov-cyan/50 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                {selectedNode.type === 'CITIZEN' ? 'Doğrulanmış Yurttaş Düğümü' : (selectedNode.type === 'EXPERT' ? 'Akademik Bilirkişi Düğümü' : 'Yasa / Konu Düğümü')}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gov-dark text-slate-400 font-mono">
                {selectedNode.id}
              </span>
            </div>

            <div className="font-extrabold text-sm sm:text-base text-gov-cyan mb-1">
              {selectedNode.label}
            </div>

            {/* Yurttaş Düğümü Detayı (Kural 3 - KYC Verisi) */}
            {selectedNode.type === 'CITIZEN' && (
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="p-2 rounded-lg bg-gov-card border border-gov-border">
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Sistem Doğrulamalı KYC (Gizli Katman):
                  </div>
                  <div className="text-white font-medium">
                    {selectedNode.raw.realIdentity.fullName} (TC: {selectedNode.raw.realIdentity.tcNo.slice(0, 3)}***)
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    İkametgah: {selectedNode.raw.realIdentity.district}, {selectedNode.raw.realIdentity.city}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span>İtibar Skoru: <b className="text-amber-400">{selectedNode.raw.publicProfile.reputationScore}/100</b></span>
                  <span>Ses Kredisi: <b className="text-white">{selectedNode.raw.publicProfile.voiceCredits} VC</b></span>
                </div>
              </div>
            )}

            {/* Bilirkişi Düğümü Detayı */}
            {selectedNode.type === 'EXPERT' && (
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="text-slate-400">{selectedNode.raw.title}</div>
                <div className="text-white font-medium">{selectedNode.raw.institution}</div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex justify-between items-center">
                  <span>Uzmanlık Katsayısı (DIF):</span>
                  <b className="text-sm font-mono">{selectedNode.raw.weightMultiplier}x Oy Gücü</b>
                </div>
              </div>
            )}

            {/* Konu Düğümü Detayı */}
            {selectedNode.type === 'TOPIC' && (
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="text-slate-400">{selectedNode.raw.category}</div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span>Kabul Oranı: <b className="text-emerald-400 font-mono">%{selectedNode.raw.voting.approvalPercentage}</b></span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                    {selectedNode.raw.status}
                  </span>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
