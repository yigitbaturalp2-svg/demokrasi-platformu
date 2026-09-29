// Web Crypto API tabanlı gerçek SHA-256 hash ve blokzincir simülatörü

export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function generateShortHash(prefix = '0x') {
  const chars = '0123456789abcdef';
  let result = prefix;
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function createBlock(index, previousHash, transactions) {
  const timestamp = new Date().toISOString();
  const txSummary = JSON.stringify(transactions);
  const nonce = Math.floor(Math.random() * 90000) + 10000;
  const hash = await sha256(`${index}-${previousHash}-${timestamp}-${txSummary}-${nonce}`);
  
  return {
    index,
    timestamp,
    previousHash,
    hash: '0x' + hash.slice(0, 16) + '...',
    fullHash: '0x' + hash,
    nonce,
    merkleRoot: '0x' + (await sha256(txSummary)).slice(0, 12),
    transactions,
    miner: 'Konsensüs Doğrulayıcı Düğümü #4'
  };
}
