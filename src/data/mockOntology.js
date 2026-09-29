// Kural 6: Hukuk ve Yönetmelik Ontolojisi (Legal Semantic Ontology)

export const LEGAL_ONTOLOGY_TREE = {
  name: 'Türkiye Cumhuriyeti Mevzuat Hiyerarşisi',
  children: [
    {
      id: 'onto-const',
      name: 'Anayasa Normları (Üst Hukuk)',
      weight: 1.0,
      articles: [
        { id: 'AY-10', title: 'Kanun Önünde Eşitlik İlkesi', description: 'Herkes dil, ırk, renk, cinsiyet, siyasi düşünce farkı gözetilmeksizin eşittir.' },
        { id: 'AY-13', title: 'Temel Hak ve Hürriyetlerin Sınırlandırılması', description: 'Hak ve hürriyetler ancak kanunla ve demokratik toplum düzeninin gereklerine uygun olarak sınırlandırılabilir.' },
        { id: 'AY-56', title: 'Sağlık Hizmetleri ve Çevrenin Korunması', description: 'Herkes, sağlıklı ve dengeli bir çevrede yaşama hakkına sahiptir. Çevreyi korumak Devletin ve vatandaşların ödevidir.' }
      ]
    },
    {
      id: 'onto-laws',
      name: 'Genel Kanunlar',
      weight: 0.8,
      articles: [
        { id: 'KN-5393', title: 'Belediye Kanunu (Madde 14 & 15)', description: 'Belediyelerin çevre, altyapı, ulaşım ve kentsel yaşam düzenleme yetkileri.' },
        { id: 'KN-2872', title: 'Çevre Kanunu (Madde 8)', description: 'Her türlü atık ve artıkların çevreye zarar verecek şekilde boşaltılması yasaktır.' },
        { id: 'KN-6698', title: 'Kişisel Verilerin Korunması Kanunu (KVKK)', description: 'Kişisel verilerin rıza olmaksızın işlenmesi ve ifşası suç teşkil eder.' }
      ]
    },
    {
      id: 'onto-regulations',
      name: 'Yönetmelikler ve Yerel Mevzuat',
      weight: 0.6,
      articles: [
        { id: 'YN-TOPLU', title: 'Toplu Taşıma ve Ulaşım Koordinasyon Yönetmeliği', description: 'Gece tarifeleri, indirimli seyahat kartları ve sefer sıklığı standartları.' },
        { id: 'YN-PARK', title: 'Park ve Yeşil Alanlar Koruma Yönetmeliği', description: 'Kentsel rekreasyon alanlarında ticari yapılaşma ve ticari faaliyet kısıtlamaları.' }
      ]
    }
  ]
};

/**
 * Bir teklifin yönetmelik ontolojisi ile uyumluluk denetim motoru
 */
export function auditTextAgainstOntology(title, content, category) {
  const text = (title + ' ' + content).toLowerCase();
  
  let score = 85;
  const matchedRules = [];
  const warnings = [];

  // Çevre ve Yeşil Alan Denetimi
  if (text.includes('yeşil') || text.includes('park') || text.includes('ağaç') || text.includes('çevre')) {
    matchedRules.push({
      rule: 'AY-56 & Çevre Kanunu Md. 8',
      status: 'UYUMLU',
      note: 'Sağlıklı çevrede yaşama hakkı ve kentsel yeşil dokunun korunması normuyla tam örtüşüyor.'
    });
    score += 8;
  }

  // Ulaşım ve Eşitlik Denetimi
  if (text.includes('ulaşım') || text.includes('otobüs') || text.includes('öğrenci') || text.includes('tarife')) {
    matchedRules.push({
      rule: '5393 Sayılı Belediye Kanunu Md. 15',
      status: 'UYUMLU',
      note: 'Belediyenin toplu taşıma hizmeti kurma ve tarife belirleme yetki alanına uygundur.'
    });
    score += 7;
  }

  // Mülkiyet veya Kısıtlama Denetimi
  if (text.includes('yasak') || text.includes('ceza') || text.includes('men')) {
    warnings.push({
      rule: 'AY-13 (Ölçülülük İlkesi)',
      status: 'DİKKAT',
      note: 'Getirilen yasak ölçülü olmalı, idari yaptırımlar kanun sınırlarını aşmamalıdır.'
    });
    score -= 5;
  }

  return {
    score: Math.min(100, Math.max(50, score)),
    classification: category || 'Genel İdare ve Kentsel Yaşam',
    matchedRules,
    warnings,
    isCompliant: score >= 70,
    timestamp: new Date().toLocaleTimeString('tr-TR')
  };
}
