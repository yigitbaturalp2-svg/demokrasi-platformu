// Karesel Oylama (Quadratic Voting - Vitalik Buterin & Glen Weyl Modeli)

/**
 * Verilen oy miktarı için harcanması gereken Ses Kredisi (Voice Credits)
 * Formül: Maliyet = Oy^2
 */
export function calculateVoiceCreditCost(votes) {
  const absVotes = Math.abs(votes);
  return absVotes * absVotes;
}

/**
 * Kullanıcının mevcut ses kredisine göre verebileceği maksimum oy sayısı
 */
export function getMaxVotesPossible(availableCredits) {
  return Math.floor(Math.sqrt(Math.max(0, availableCredits)));
}

/**
 * Azınlık Koruma Eşiği (Minority Quorum Safe Harbor):
 * Bir konu azınlık etki alanındaysa (%30 azınlık desteği zorunlu)
 */
export function checkMinorityProtection(totalYes, totalNo, minorityYes, minorityNo) {
  const totalVotes = totalYes + totalNo;
  const minorityVotes = minorityYes + minorityNo;
  
  if (minorityVotes === 0) return { passed: true, reason: 'Azınlık itirazı bulunmuyor' };
  
  const minorityApprovalRatio = minorityYes / minorityVotes;
  const passed = minorityApprovalRatio >= 0.30;
  
  return {
    passed,
    approvalRatio: (minorityApprovalRatio * 100).toFixed(1),
    reason: passed 
      ? 'Azınlık koruma eşiği (%30) aşıldı.' 
      : 'Çoğunluğun zorbalığı engellendi: Doğrudan etkilenen azınlığın desteği %30 barajının altında kaldı.'
  };
}
