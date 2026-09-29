// Dağıtık Defter ve Blokzincir Veri Yapısı (Distributed Ledger)

export const INITIAL_BLOCKCHAIN = [
  {
    index: 1045,
    timestamp: '2026-09-29T17:30:12Z',
    previousHash: '0x0000a4b91f08e41c33887...',
    hash: '0x0000e84b12f990ac',
    fullHash: '0x0000e84b12f990ac5d891b248a31e8c049d91f28b7e2a90184c7e891234abcde',
    nonce: 74912,
    merkleRoot: '0x3f9a88c21e01',
    transactions: [
      { id: 'tx-901', type: 'TOPIC_CREATE', title: 'Yeşil Alanların Korunması', author: '@AdaletSavunucusu', hash: '0x88f1a...' },
      { id: 'tx-902', type: 'VOTE_CAST', method: 'QUADRATIC_VOTING', credits: 9, votes: 3, voter: '@GelecekOncusu' }
    ],
    miner: 'Konsensüs Düğümü #1 (Kadıköy)'
  },
  {
    index: 1046,
    timestamp: '2026-09-29T18:15:40Z',
    previousHash: '0x0000e84b12f990ac...',
    hash: '0x00003b7194f109de',
    fullHash: '0x00003b7194f109de39a1b44c801e7655489f01abce471092837481928301abcd',
    nonce: 41289,
    merkleRoot: '0x99a1bc4028fa',
    transactions: [
      { id: 'tx-903', type: 'AMENDMENT_PROPOSE', topicId: 'top-001', author: '@EkolojikDenge', hash: '0x11e4f...' },
      { id: 'tx-904', type: 'COMMENT_IMMUTABLE', author: '@DemokrasiBekcisi', contentHash: '0x44fa7...' }
    ],
    miner: 'Konsensüs Düğümü #3 (Çankaya)'
  }
];
