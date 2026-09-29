import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TopicList } from './components/TopicList';
import { TopicDetailModal } from './components/TopicDetailModal';
import { DiscussionArea } from './components/DiscussionArea';
import { CreateTopicModal } from './components/CreateTopicModal';
import { InteractiveGraph } from './components/InteractiveGraph';
import { ExpertOntologyView } from './components/ExpertOntologyView';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { KYCModal } from './components/KYCModal';
import { AICopilotModal } from './components/AICopilotModal';
import { InstallModal } from './components/InstallModal';
import confetti from 'canvas-confetti';

import { MOCK_CITIZENS, CURRENT_ACTIVE_USER } from './data/mockCitizens';
import { INITIAL_TOPICS } from './data/mockTopics';
import { INITIAL_BLOCKCHAIN } from './data/mockBlockchain';
import { createBlock, generateShortHash } from './utils/cryptoSim';

export default function App() {
  const [activeUser, setActiveUser] = useState(CURRENT_ACTIVE_USER);
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [blockchain, setBlockchain] = useState(INITIAL_BLOCKCHAIN);
  const [userVotes, setUserVotes] = useState({}); // { [topicId]: votesCount }
  const [activeTab, setActiveTab] = useState('topics'); // topics, graph, ontology, ledger, kyc

  // Modallar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [selectedTopicForDetails, setSelectedTopicForDetails] = useState(null);
  const [selectedTopicForDiscussion, setSelectedTopicForDiscussion] = useState(null);

  // Karesel Oylama ile Oy Verme
  const handleVote = async (topicId, newVotes, creditCost) => {
    setUserVotes(prev => ({ ...prev, [topicId]: newVotes }));

    // Kullanıcının harcanan kredisini güncelle
    setActiveUser(prev => ({
      ...prev,
      publicProfile: {
        ...prev.publicProfile,
        spentCredits: prev.publicProfile.spentCredits + creditCost
      }
    }));

    // Konu oylarını güncelle
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const yesInc = newVotes > (userVotes[topicId] || 0) ? 1 : -1;
        const newYes = Math.max(0, t.voting.yesVotes + yesInc);
        const total = newYes + t.voting.noVotes;
        return {
          ...t,
          voting: {
            ...t.voting,
            yesVotes: newYes,
            totalParticipants: total,
            approvalPercentage: Math.round((newYes / (total || 1)) * 100),
            quadraticCreditsSpent: t.voting.quadraticCreditsSpent + Math.abs(creditCost)
          }
        };
      }
      return t;
    }));

    // Dağıtık deftere yeni blok/işlem yaz
    const lastBlock = blockchain[blockchain.length - 1];
    const newTx = {
      id: 'tx-' + Date.now(),
      type: 'VOTE_CAST_QUADRATIC',
      topicId,
      voter: activeUser.publicProfile.pseudonym,
      votes: newVotes,
      costCredits: creditCost,
      hash: generateShortHash('0x')
    };

    const newBlock = await createBlock(lastBlock.index + 1, lastBlock.hash, [newTx]);
    setBlockchain(prev => [...prev, newBlock]);
  };

  // Yeni Konu Ekleme (Kural 1 & 4)
  const handleCreateTopic = async (newTopic) => {
    setTopics(prev => [newTopic, ...prev]);

    // Blok oluştur
    const lastBlock = blockchain[blockchain.length - 1];
    const newTx = {
      id: 'tx-' + Date.now(),
      type: 'TOPIC_CREATE',
      title: newTopic.title,
      author: activeUser.publicProfile.pseudonym,
      hash: generateShortHash('0x')
    };

    const newBlock = await createBlock(lastBlock.index + 1, lastBlock.hash, [newTx]);
    setBlockchain(prev => [...prev, newBlock]);
  };

  // Silinmeyen Yorum Ekleme (Kural 7)
  const handleAddComment = async (topicId, newComment) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, comments: [...t.comments, newComment] };
      }
      return t;
    }));

    if (selectedTopicForDiscussion?.id === topicId) {
      setSelectedTopicForDiscussion(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
    }

    // Blokzincire yaz
    const lastBlock = blockchain[blockchain.length - 1];
    const newTx = {
      id: 'tx-' + Date.now(),
      type: 'COMMENT_IMMUTABLE',
      topicId,
      author: newComment.author,
      contentHash: newComment.blockHash
    };

    const newBlock = await createBlock(lastBlock.index + 1, lastBlock.hash, [newTx]);
    setBlockchain(prev => [...prev, newBlock]);
  };

  // Kural 8: Yorum Silme Oylaması Başlatma
  const handleStartRedactionVote = (topicId, commentId, reason) => {
    const updater = (comments) => comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isUnderRedactionVote: true,
          redactionReason: reason,
          redactionVotes: {
            deleteVotes: 1,
            keepVotes: 0,
            total: 1,
            percentage: 100,
            isRedacted: false
          }
        };
      }
      return c;
    });

    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, comments: updater(t.comments) } : t));
    if (selectedTopicForDiscussion?.id === topicId) {
      setSelectedTopicForDiscussion(prev => ({ ...prev, comments: updater(prev.comments) }));
    }
  };

  // Kural 8: Yorum Silme Oylamasında Oy Kullanma
  const handleCastRedactionVote = (topicId, commentId, voteType) => {
    const updater = (comments) => comments.map(c => {
      if (c.id === commentId && c.isUnderRedactionVote) {
        const cur = c.redactionVotes || { deleteVotes: 0, keepVotes: 0, total: 0 };
        const newDelete = voteType === 'DELETE' ? cur.deleteVotes + 1 : cur.deleteVotes;
        const newKeep = voteType === 'KEEP' ? cur.keepVotes + 1 : cur.keepVotes;
        const newTotal = newDelete + newKeep;
        const percentage = Math.round((newDelete / newTotal) * 100);
        const shouldRedact = percentage >= 66 && newTotal >= 3;

        return {
          ...c,
          redactionVotes: {
            deleteVotes: newDelete,
            keepVotes: newKeep,
            total: newTotal,
            percentage,
            isRedacted: shouldRedact
          }
        };
      }
      return c;
    });

    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, comments: updater(t.comments) } : t));
    if (selectedTopicForDiscussion?.id === topicId) {
      setSelectedTopicForDiscussion(prev => ({ ...prev, comments: updater(prev.comments) }));
    }
  };

  // Alt Konu Ekleme (Kural 5)
  const handleAddSubTopic = (topicId, subTopic) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, subTopics: [...(t.subTopics || []), subTopic] };
      }
      return t;
    }));
  };

  // Kural 4: Oylamayı Sonuçlandır & Mevzuat Haline Getir (Demo Lifecycle)
  const handleFinalizeTopic = async (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const isPassed = topic.voting.approvalPercentage >= 50;
    const newStatus = isPassed ? 'KABUL_EDILDI' : 'REDDEDILDI';

    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: newStatus } : t));

    if (isPassed) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    const lastBlock = blockchain[blockchain.length - 1];
    const newTx = {
      id: 'tx-finalize-' + Date.now(),
      type: isPassed ? 'TOPIC_ENACTED' : 'TOPIC_REJECTED',
      topicId,
      title: topic.title,
      result: newStatus,
      hash: generateShortHash('0x')
    };
    const newBlock = await createBlock(lastBlock.index + 1, lastBlock.hash, [newTx]);
    setBlockchain(prev => [...prev, newBlock]);
  };

  // Kural 5: Alt Konuya Oy Verme
  const handleVoteSubTopic = async (topicId, subTopicId, voteType) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId && t.subTopics) {
        const updatedSubs = t.subTopics.map(sub => {
          if (sub.id === subTopicId) {
            const yes = voteType === 'YES' ? sub.yesVotes + 1 : sub.yesVotes;
            const no = voteType === 'NO' ? sub.noVotes + 1 : sub.noVotes;
            const total = yes + no;
            const pct = Math.round((yes / (total || 1)) * 100);
            return {
              ...sub,
              yesVotes: yes,
              noVotes: no,
              approvalPercentage: pct,
              status: pct >= 50 && total >= 3 ? 'KABUL_EDILDI' : 'OYLAMADA'
            };
          }
          return sub;
        });
        return { ...t, subTopics: updatedSubs };
      }
      return t;
    }));

    if (selectedTopicForDetails?.id === topicId) {
      setSelectedTopicForDetails(prev => {
        const updatedSubs = prev.subTopics?.map(sub => {
          if (sub.id === subTopicId) {
            const yes = voteType === 'YES' ? sub.yesVotes + 1 : sub.yesVotes;
            const no = voteType === 'NO' ? sub.noVotes + 1 : sub.noVotes;
            const total = yes + no;
            const pct = Math.round((yes / (total || 1)) * 100);
            return {
              ...sub,
              yesVotes: yes,
              noVotes: no,
              approvalPercentage: pct,
              status: pct >= 50 && total >= 3 ? 'KABUL_EDILDI' : 'OYLAMADA'
            };
          }
          return sub;
        });
        return { ...prev, subTopics: updatedSubs };
      });
    }
  };

  // Kural 1: Düzenleme Teklifine Oy Verme
  const handleVoteAmendment = async (topicId, amendmentId, voteType) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId && t.amendment && t.amendment.id === amendmentId) {
        const yes = voteType === 'YES' ? t.amendment.votesYes + 1 : t.amendment.votesYes;
        const no = voteType === 'NO' ? t.amendment.votesNo + 1 : t.amendment.votesNo;
        return {
          ...t,
          amendment: { ...t.amendment, votesYes: yes, votesNo: no }
        };
      }
      return t;
    }));

    if (selectedTopicForDetails?.id === topicId) {
      setSelectedTopicForDetails(prev => ({
        ...prev,
        amendment: {
          ...prev.amendment,
          votesYes: voteType === 'YES' ? prev.amendment.votesYes + 1 : prev.amendment.votesYes,
          votesNo: voteType === 'NO' ? prev.amendment.votesNo + 1 : prev.amendment.votesNo
        }
      }));
    }
  };

  // Kural 1: Düzenleme Teklifini Kabul Edip Ana Metne İşleme (PR Merge)
  const handleAdoptAmendment = async (topicId, amendmentId) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId && t.amendment && t.amendment.id === amendmentId) {
        return {
          ...t,
          content: t.amendment.proposedText,
          hasAmendment: false,
          amendment: { ...t.amendment, status: 'KABUL_EDILDI' }
        };
      }
      return t;
    }));

    if (selectedTopicForDetails?.id === topicId) {
      setSelectedTopicForDetails(prev => ({
        ...prev,
        content: prev.amendment.proposedText,
        hasAmendment: false,
        amendment: { ...prev.amendment, status: 'KABUL_EDILDI' }
      }));
    }

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });

    const lastBlock = blockchain[blockchain.length - 1];
    const newTx = {
      id: 'tx-amend-merge-' + Date.now(),
      type: 'AMENDMENT_ADOPTED',
      topicId,
      hash: generateShortHash('0x')
    };
    const newBlock = await createBlock(lastBlock.index + 1, lastBlock.hash, [newTx]);
    setBlockchain(prev => [...prev, newBlock]);
  };

  // Manuel Demo Blok Kazma
  const handleMineNewBlock = async () => {
    const lastBlock = blockchain[blockchain.length - 1];
    const demoTx = {
      id: 'tx-manual-' + Date.now(),
      type: 'CONSENSUS_HEARTBEAT',
      author: 'Ağ Doğrulayıcısı #1',
      hash: generateShortHash('0x')
    };
    const newBlock = await createBlock(lastBlock.index + 1, lastBlock.hash, [demoTx]);
    setBlockchain(prev => [...prev, newBlock]);
  };

  const availableCredits = activeUser.publicProfile.voiceCredits - activeUser.publicProfile.spentCredits;

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col selection:bg-gov-accent selection:text-white">
      
      {/* 1. Üst Bar (Header) */}
      <Header
        activeUser={activeUser}
        onOpenCreate={() => setShowCreateModal(true)}
        onOpenAI={() => setShowAIModal(true)}
        onOpenKYC={() => setShowKYCModal(true)}
        onOpenInstall={() => setShowInstallModal(true)}
        blockHeight={blockchain[blockchain.length - 1].index}
      />

      {/* 2. Ana Gövde */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-28">
        
        {/* TAB 1: KONULAR VE OYLAMA */}
        {activeTab === 'topics' && (
          <TopicList
            topics={topics}
            userVotes={userVotes}
            onVote={handleVote}
            onOpenDetails={(topic) => setSelectedTopicForDetails(topic)}
            onOpenDiscussion={(topic) => setSelectedTopicForDiscussion(topic)}
            onOpenAmendmentDiff={(topic) => setSelectedTopicForDetails(topic)}
            onOpenCreate={() => setShowCreateModal(true)}
            userAvailableCredits={availableCredits}
            onFinalizeTopic={handleFinalizeTopic}
            onVoteSubTopic={handleVoteSubTopic}
          />
        )}

        {/* TAB 2: İNSAN GRAFI (Web of Trust) */}
        {activeTab === 'graph' && (
          <InteractiveGraph
            topics={topics}
            onSelectTopic={(t) => setSelectedTopicForDetails(t)}
          />
        )}

        {/* TAB 3: BİLİRKİŞİ VE YÖNETMELİK ONTOLOJİSİ */}
        {activeTab === 'ontology' && (
          <ExpertOntologyView />
        )}

        {/* TAB 4: DAĞITIK DEFTER (Blockchain Explorer) */}
        {activeTab === 'ledger' && (
          <BlockchainExplorer
            blockchain={blockchain}
            onMineNewBlock={handleMineNewBlock}
          />
        )}

        {/* TAB 5: KİMLİK VE KYC (Kural 3) */}
        {activeTab === 'kyc' && (
          <div className="max-w-xl mx-auto">
            <KYCModal
              activeUser={activeUser}
              onSwitchUser={(user) => setActiveUser(user)}
              onClose={null}
            />
          </div>
        )}

      </main>

      {/* 3. Mobil Alt Bar (Bottom Nav) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. Açılır Modallar */}
      {showCreateModal && (
        <CreateTopicModal
          onClose={() => setShowCreateModal(false)}
          activeUser={activeUser}
          onCreateTopic={handleCreateTopic}
        />
      )}

      {selectedTopicForDetails && (
        <TopicDetailModal
          topic={selectedTopicForDetails}
          onClose={() => setSelectedTopicForDetails(null)}
          onOpenDiscussion={(topic) => setSelectedTopicForDiscussion(topic)}
          onAddSubTopic={handleAddSubTopic}
          activeUser={activeUser}
          onVoteAmendment={handleVoteAmendment}
          onAdoptAmendment={handleAdoptAmendment}
          onVoteSubTopic={handleVoteSubTopic}
        />
      )}

      {selectedTopicForDiscussion && (
        <DiscussionArea
          topic={selectedTopicForDiscussion}
          onClose={() => setSelectedTopicForDiscussion(null)}
          activeUser={activeUser}
          onAddComment={handleAddComment}
          onStartRedactionVote={handleStartRedactionVote}
          onCastRedactionVote={handleCastRedactionVote}
        />
      )}

      {showAIModal && (
        <AICopilotModal
          onClose={() => setShowAIModal(false)}
          topics={topics}
        />
      )}

      {showKYCModal && (
        <KYCModal
          activeUser={activeUser}
          onSwitchUser={(user) => setActiveUser(user)}
          onClose={() => setShowKYCModal(false)}
        />
      )}

      {showInstallModal && (
        <InstallModal
          onClose={() => setShowInstallModal(false)}
          publicUrl="https://bumpy-dryers-cheer.loca.lt"
          tunnelPassword="81.213.46.54"
        />
      )}

    </div>
  );
}
