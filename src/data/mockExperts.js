// Bilirkişi Entegrasyonu (Expert Domain Multiplier & Independent Advisory)

export const MOCK_EXPERTS = [
  {
    id: 'exp-001',
    name: 'Prof. Dr. İlker Yılmaz',
    title: 'Anayasa ve İdare Hukukçusu',
    institution: 'İstanbul Hukuk Fakültesi',
    avatarColor: 'from-amber-500 to-yellow-600',
    domainTag: '#HukukVeMevzuat',
    weightMultiplier: 2.5, // Kararlarda uzmanlık oy katsayısı
    verifiedCredentialHash: '0x99281aef114b01e99824',
    evaluations: [
      {
        topicId: 'top-001',
        verdict: 'ONAY',
        technicalScore: 9.4,
        reportSummary: 'Teklif metni belediye yetki alanları ve Anayasa Md. 56 ile tam uyumludur. İdari vesayet veya mülkiyet hakkı ihlali içermemektedir.',
        date: '2026-09-28'
      },
      {
        topicId: 'top-002',
        verdict: 'ONAY_SARTLI',
        technicalScore: 8.6,
        reportSummary: 'Gece tarifelerinde kamu yararı gözetilmiştir; ancak belediye bütçe dengesi açısından sübvansiyon kalemi açıkça tanımlanmalıdır.',
        date: '2026-09-27'
      }
    ]
  },
  {
    id: 'exp-002',
    name: 'Doç. Dr. Ayşe Gültekin',
    title: 'Şehir ve Bölge Plancısı & Çevre Mühendisi',
    institution: 'ODTÜ Mimarlık & Şehircilik',
    avatarColor: 'from-emerald-500 to-green-600',
    domainTag: '#CevreVeSehircilik',
    weightMultiplier: 2.0,
    verifiedCredentialHash: '0x33441fe9a01c84112e09',
    evaluations: [
      {
        topicId: 'top-001',
        verdict: 'TAM_DESTEK',
        technicalScore: 9.8,
        reportSummary: 'Kentsel yeşil koridorların yapılaşmaya kapatılması iklim uyum planımız için hayati öneme sahiptir. Bilirkişi heyeti olarak tam destek veriyoruz.',
        date: '2026-09-29'
      }
    ]
  },
  {
    id: 'exp-003',
    name: 'Dr. Tarık Can',
    title: 'Ulaşım Sistemleri ve Kent Ekonomisti',
    institution: 'İTÜ Ulaşım Anabilim Dalı',
    avatarColor: 'from-blue-500 to-indigo-600',
    domainTag: '#UlasimVeAltyapi',
    weightMultiplier: 1.8,
    verifiedCredentialHash: '0x772109ba44e101f33211',
    evaluations: [
      {
        topicId: 'top-002',
        verdict: 'ONAY',
        technicalScore: 9.1,
        reportSummary: '24 saatlik toplu taşıma genç nüfusun gece güvenliğini artırırken karbon salınımını %14 oranında azaltacaktır.',
        date: '2026-09-27'
      }
    ]
  }
];
