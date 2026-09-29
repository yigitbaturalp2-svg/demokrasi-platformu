// Kural 1, 2, 4, 5, 7, 8: Konular, Alt Konular, Düzenleme Teklifleri ve Değiştirilemez Tartışmalar

export const INITIAL_TOPICS = [
  {
    id: 'top-001',
    title: 'Kentsel Yeşil Koridorların Korunması ve Yapılaşma Yasağı Yönetmeliği',
    author: '@AdaletSavunucusu',
    authorZkpBadge: 'Kadıköy Seçmeni (18+ Doğrulanmış)',
    status: 'OYLAMADA', // OYLAMADA, KABUL_EDILDI, REDDEDILDI
    category: 'Çevre ve Şehircilik Ontolojisi',
    createdAt: '2026-09-28',
    deadlineHoursLeft: 34,
    
    // Konu Metni (Orijinal)
    content: 'İl sınırları içerisindeki tüm tescilli park, koru ve kentsel yeşil alanlarda hiçbir gerekçeyle kalıcı veya geçici ticari yapı inşa edilemez. Mevcut yeşil doku zedelenemez; çevre düzenlemelerinde betonlaşma yerine geçirgen doğal zemin mecburidir.',
    
    // Kural 1: Düzenleme Teklifi (Amendment / Diff)
    hasAmendment: true,
    amendment: {
      id: 'amend-01',
      proposer: '@EkolojikDenge',
      title: 'Madde 2 Ek Düzenleme Teklifi: Yağmur Suyu Hasadı Zorunluluğu',
      oldText: 'Mevcut yeşil doku zedelenemez; çevre düzenlemelerinde betonlaşma yerine geçirgen doğal zemin mecburidir.',
      proposedText: 'Mevcut yeşil doku zedelenemez; çevre düzenlemelerinde betonlaşma yerine geçirgen doğal zemin mecburidir. Ayrıca park alanlarında yağmur suyu hasadı göletleri kurulması zorunludur.',
      votesYes: 48,
      votesNo: 12,
      status: 'OYLAMADA'
    },

    // Kural 2: Oylama ve Çoğunluk Oranları
    voting: {
      yesVotes: 342,
      noVotes: 114,
      totalParticipants: 456,
      quorumRequired: 200, // Yetersayı / Baraj
      isQuorumMet: true,
      approvalPercentage: 75,
      // Çoğunluğun Azınlığı Ezmesini Önleyen Karesel Oylama İstatistiği
      quadraticCreditsSpent: 1840,
      minorityProtectionActive: true
    },

    // Kural 5: Alt Konular (Sub-topics) - Bağımsız Oylamada
    subTopics: [
      {
        id: 'sub-001-1',
        title: 'Park İçi Bisiklet ve Koşu Yolları Standardı',
        proposer: '@GelecekOncusu',
        status: 'KABUL_EDILDI',
        yesVotes: 280,
        noVotes: 40,
        approvalPercentage: 87.5
      },
      {
        id: 'sub-001-2',
        title: 'Gece Park Aydınlatmalarının Güneş Enerjisine Geçirilmesi',
        proposer: '@DemokrasiBekcisi',
        status: 'OYLAMADA',
        yesVotes: 195,
        noVotes: 65,
        approvalPercentage: 75.0
      }
    ],

    // Kural 6: Yönetmelik Ontolojisi Denetim Raporu
    ontologyAudit: {
      score: 96,
      isCompliant: true,
      legalMatches: ['AY-56 (Çevre Hakkı)', '2872 Sayılı Çevre Kanunu Md. 8', '5393 Sayılı Belediye Kanunu Md. 14'],
      aiSummary: 'Teklif, anayasal çevre koruma normları ve yerel yönetim mevzuatıyla %96 uyumludur. Hukuki risk tespit edilmemiştir.'
    },

    // Kural 7 & 8: Silinmeyen Tartışmalar + Silme Oylaması Modeli
    comments: [
      {
        id: 'com-101',
        author: '@EkolojikDenge',
        text: 'Bu yönetmelik gelecek kuşakların nefes alabilmesi için şart. Özellikle betonlaşmayı önleyen 2. maddeyi çok önemsiyorum.',
        timestamp: '2026-09-28 14:22',
        blockHash: '0x8f192b001a4c',
        isUnderRedactionVote: false, // Silme oylamasında mı?
        redactionVotes: { yes: 0, no: 0, requiredThreshold: 0.66 }
      },
      {
        id: 'com-102',
        author: '@AnonimGirisimci',
        text: 'Belediyenin kafelerden aldığı işgaliye gelirleri kesilirse bütçe açık verir. Bu teklif belediyeyi iflasa sürükler!',
        timestamp: '2026-09-28 16:05',
        blockHash: '0x77ab1289cf01',
        isUnderRedactionVote: false,
        redactionVotes: { yes: 0, no: 0, requiredThreshold: 0.66 }
      },
      {
        id: 'com-103',
        author: '@TrollProvokator',
        // Kural 8'i göstermek için hazır oylamadaki yorum:
        text: 'Bu tasarıyı destekleyenlerin tamamı vatan hainidir ve şu adresteki (...şahsi adres ifşası...) derneğe hesap vermelidir!',
        timestamp: '2026-09-29 09:12',
        blockHash: '0x33e410f881ab',
        isUnderRedactionVote: true, // Kural 8: Silme oylamasına çıkarıldı!
        redactionReason: 'KVKK İhlali (Şahsi adres ifşası) ve Nefret Söylemi',
        redactionVotes: {
          deleteVotes: 142,
          keepVotes: 18,
          total: 160,
          percentage: 88.7, // %66 barajını aştığı için jüri kararıyla gizlenebilir
          isRedacted: false
        }
      }
    ]
  },
  {
    id: 'top-002',
    title: 'Toplu Taşımada 24 Saat Kesintisiz Gece Seferleri ve Genç Yurttaş Tarifesi',
    author: '@DemokrasiBekcisi',
    authorZkpBadge: 'Karşıyaka Seçmeni (Gençlik Temsilcisi)',
    status: 'KABUL_EDILDI', // Kural 4: Kabul edildi ve resmi yönetmelik oldu!
    category: 'Ulaşım ve Sosyal Haklar Ontolojisi',
    createdAt: '2026-09-20',
    deadlineHoursLeft: 0,
    
    content: 'Metro, tramvay ve ana otobüs arterlerinde Cuma, Cumartesi ve Pazar geceleri kesintisiz ulaşım sağlanacaktır. 25 yaş altı doğrulanmış tüm genç yurttaşlar için gece tarifesinde %50 indirim sübvansiyonu uygulanacaktır.',
    
    hasAmendment: false,
    amendment: null,

    voting: {
      yesVotes: 890,
      noVotes: 98,
      totalParticipants: 988,
      quorumRequired: 300,
      isQuorumMet: true,
      approvalPercentage: 90.0,
      quadraticCreditsSpent: 4200,
      minorityProtectionActive: false
    },

    subTopics: [
      {
        id: 'sub-002-1',
        title: 'Gece Kadın ve Çocuk Güvenlik Butonlarının Araçlara Entegrasyonu',
        proposer: '@GelecekOncusu',
        status: 'KABUL_EDILDI',
        yesVotes: 910,
        noVotes: 12,
        approvalPercentage: 98.7
      }
    ],

    ontologyAudit: {
      score: 91,
      isCompliant: true,
      legalMatches: ['5393 Sayılı Belediye Kanunu Md. 15', 'Gençlik ve Spor Hizmetleri Kanunu'],
      aiSummary: 'Sosyal devlet ilkesi ve gençlerin kentsel katılımı açısından mevzuata tam uygundur.'
    },

    comments: [
      {
        id: 'com-201',
        author: '@AdaletSavunucusu',
        text: 'Bu teklif gençlerin gece güvenli şekilde evlerine ulaşmasını garanti altına aldı. Demokrasi protokolünün ilk zaferlerinden biri.',
        timestamp: '2026-09-22 11:30',
        blockHash: '0x114400aefbc8',
        isUnderRedactionVote: false,
        redactionVotes: { yes: 0, no: 0, requiredThreshold: 0.66 }
      }
    ]
  },
  {
    id: 'top-003',
    title: 'Sokak Hayvanları Bakım Merkezlerinin Denetimi ve Mahalle Besleme Odakları',
    author: '@GelecekOncusu',
    authorZkpBadge: 'Çankaya Seçmeni (Hayvan Hakları Temsilcisi)',
    status: 'OYLAMADA',
    category: 'Canlı Hakları ve Sağlık Ontolojisi',
    createdAt: '2026-09-29',
    deadlineHoursLeft: 58,
    
    content: 'Mahalle bazında yerel veteriner hekim odaları ve hayvan hakları dernekleri denetiminde hijyenik besleme odakları oluşturulacak; kısırlaştırma ve aşı takip süreçleri halka açık blokzincir defterine kaydedilecektir.',
    
    hasAmendment: false,
    amendment: null,

    // Karesel Oylamanın ve Azınlık Korumasının Devrede Olduğu Vaka:
    voting: {
      yesVotes: 210,
      noVotes: 195,
      totalParticipants: 405,
      quorumRequired: 200,
      isQuorumMet: true,
      approvalPercentage: 51.8,
      quadraticCreditsSpent: 2950,
      minorityProtectionActive: true // Azınlık koruma eşiği devrede
    },

    subTopics: [],

    ontologyAudit: {
      score: 88,
      isCompliant: true,
      legalMatches: ['5199 Sayılı Hayvanları Koruma Kanunu', 'Veteriner Hizmetleri Kanunu'],
      aiSummary: '5199 sayılı kanun ile uyumludur. Sağlık ve kamu güvenliği dengesi kurulmuştur.'
    },

    comments: [
      {
        id: 'com-301',
        author: '@EkolojikDenge',
        text: 'Kısırlaştırma verilerinin blokzincire yazılması sahte aşı ve kayıp hayvan sorununu kökten çözer.',
        timestamp: '2026-09-29 18:04',
        blockHash: '0x66f1092a18cc',
        isUnderRedactionVote: false,
        redactionVotes: { yes: 0, no: 0, requiredThreshold: 0.66 }
      }
    ]
  }
];
