// Kural 3: Sistem tarafından kayıtlı resmi kimlik bilgileri (KYC) + Halka açık Takma Ad (ZKP DID)

export const MOCK_CITIZENS = [
  {
    id: 'cit-001',
    // Sistem tarafından doğrulanan resmi veriler (Gizli/KYC Katmanı)
    realIdentity: {
      fullName: 'Yiğit Özdemir',
      tcNo: '38291048291',
      birthDate: '1998-05-14',
      city: 'İstanbul',
      district: 'Kadıköy',
      addressProofHash: '0x9fa4b2e811c7d23a48e21',
      isVerifiedByState: true
    },
    // Kamusal alanda görünen bilgiler
    publicProfile: {
      pseudonym: '@AdaletSavunucusu',
      avatarColor: 'from-blue-500 to-cyan-500',
      zkpBadge: 'ZKP Doğrulanmış Yurttaş',
      reputationScore: 98,
      voiceCredits: 100, // Karesel oylama için toplam ses kredisi
      spentCredits: 25,
      role: 'Yurttaş & Topluluk Temsilcisi',
      badges: ['Doğrulanmış İkametgah', 'Kadıköy Seçmeni', '18+ Onaylı', 'Aktif Katılımcı']
    },
    trustConnections: ['cit-002', 'exp-001', 'cit-004']
  },
  {
    id: 'cit-002',
    realIdentity: {
      fullName: 'Zeynep Aksoy',
      tcNo: '19482019482',
      birthDate: '1995-11-23',
      city: 'Ankara',
      district: 'Çankaya',
      addressProofHash: '0x7b1c3e4499f018a992bc',
      isVerifiedByState: true
    },
    publicProfile: {
      pseudonym: '@GelecekOncusu',
      avatarColor: 'from-purple-500 to-pink-500',
      zkpBadge: 'ZKP Doğrulanmış Yurttaş',
      reputationScore: 94,
      voiceCredits: 100,
      spentCredits: 36,
      role: 'Yurttaş & Çevre Gözlemcisi',
      badges: ['Çankaya Seçmeni', 'Mevzuat Denetçisi']
    },
    trustConnections: ['cit-001', 'exp-002']
  },
  {
    id: 'cit-003',
    realIdentity: {
      fullName: 'Emre Şahin',
      tcNo: '58201948201',
      birthDate: '2001-02-18',
      city: 'İzmir',
      district: 'Karşıyaka',
      addressProofHash: '0x5c889f0a213e47781b44',
      isVerifiedByState: true
    },
    publicProfile: {
      pseudonym: '@DemokrasiBekcisi',
      avatarColor: 'from-emerald-500 to-teal-500',
      zkpBadge: 'ZKP Doğrulanmış Yurttaş',
      reputationScore: 89,
      voiceCredits: 100,
      spentCredits: 16,
      role: 'Gençlik Meclisi Delegesi',
      badges: ['Karşıyaka Seçmeni', '18+ Onaylı']
    },
    trustConnections: ['cit-001', 'cit-002']
  },
  {
    id: 'cit-004',
    realIdentity: {
      fullName: 'Selin Doğan',
      tcNo: '44810294819',
      birthDate: '1989-08-30',
      city: 'Bursa',
      district: 'Nilüfer',
      addressProofHash: '0x33e89a4412c98d7710fa',
      isVerifiedByState: true
    },
    publicProfile: {
      pseudonym: '@EkolojikDenge',
      avatarColor: 'from-amber-500 to-orange-500',
      zkpBadge: 'ZKP Doğrulanmış Yurttaş',
      reputationScore: 96,
      voiceCredits: 100,
      spentCredits: 49,
      role: 'Azınlık ve Çevre Sözcüsü',
      badges: ['Nilüfer Seçmeni', 'Çevre Savunucusu']
    },
    trustConnections: ['exp-002', 'cit-001']
  }
];

export const CURRENT_ACTIVE_USER = MOCK_CITIZENS[0]; // Yiğit Özdemir (@AdaletSavunucusu)
