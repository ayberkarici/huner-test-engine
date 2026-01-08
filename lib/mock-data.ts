// Sample medical report text for demonstration
export const sampleMedicalReport = `
HASTA RAPORU

Rapor No: 2024-MR-789456
Protokol No: PRK-2024-123
Rapor Tarihi: 15/03/2024
Rapor Türü: İlaç Kullanım Raporu

SAĞLIK TESİSİ BİLGİLERİ
Kurum Kodu: 11068743
Kurum Adı: İstanbul Üniversitesi Tıp Fakültesi Hastanesi

HASTA BİLGİLERİ
Cinsiyet: Erkek
Doğum Tarihi: 22/05/1978

TANILAR
1. Romatoid Artrit (M05.8) - Seropozitif romatoid artrit, diğer
   Başlangıç: 10/01/2020
   Tanı açıklaması: Hasta 4 yıldır romatoid artrit tanısıyla takip edilmektedir. Bilateral el ve ayak bilek eklemlerinde aktif sinovit mevcuttur.

2. Hipertansiyon (I10) - Esansiyel (primer) hipertansiyon
   Başlangıç: 05/03/2018

REÇETE EDİLEN İLAÇLAR
1. Adalimumab (HUMIRA) 40 mg Enjeksiyonluk Çözelti - Prefilled Şırınga
   SGK Kodu: 8699514013105
   Form: Subkutan enjeksiyon
   Doz: 40 mg
   Kullanım: 2 haftada 1 kez, 1 adet
   Ekleme Tarihi: 15/03/2024 09:30

2. Metotreksat 2.5 mg Tablet
   SGK Kodu: 8699504350142
   Form: Oral tablet
   Doz: 15 mg/hafta (6 tablet)
   Kullanım: Haftada 1 kez, 6 tablet (Cumartesi günü)
   Ekleme Tarihi: 15/03/2024 09:35

3. Folik Asit 5 mg Tablet
   Form: Oral tablet
   Doz: 5 mg
   Kullanım: Haftada 1 kez (Metotreksat alımından 24-48 saat sonra)
   Ekleme Tarihi: 15/03/2024 09:36

HEKİM BİLGİLERİ
Dr. Ayşe Yılmaz
Uzmanlık: Romatoloji
Diploma No: 45678
Sicil No: TR-ROM-2015-001

LABORATUVAR BULGULARI
- CRP: 2.8 mg/L (Normal: <5) - Tarih: 10/03/2024
- ESH: 28 mm/saat (Normal: <20) - Tarih: 10/03/2024
- RF: 156 IU/mL (Pozitif) - Tarih: 10/03/2024
- Anti-CCP: 245 U/mL (Yüksek pozitif) - Tarih: 10/03/2024
- ALT: 24 U/L (Normal) - Tarih: 10/03/2024
- Kreatinin: 0.9 mg/dL (Normal) - Tarih: 10/03/2024

KLİNİK ÖZET
Hasta 2020 yılında romatoid artrit tanısı almış olup, başlangıçta konvansiyonel DMARD tedavisi (metotreksat) başlanmıştır. 2022 yılında hastalık aktivitesi artış gösterince adalimumab tedavisi eklenmiştir. Mevcut durumda DAS28-CRP skoru 3.2 olup orta hastalık aktivitesi mevcuttur. Tedaviye uyumu iyidir.

ALERJİLER
- Penisilin grubu antibiyotiklere alerji (ürtiker)
- Sulfonamid grubu ilaçlara hassasiyet

KONTRENDİKASYONLAR
- Aktif enfeksiyon varlığında adalimumab kullanılmamalıdır
- Canlı aşı uygulaması kontrendikedir
- Metotreksat ile NSAİİ etkileşimi - dikkatli kullanılmalıdır

YAN ETKİLER
- Adalimumab enjeksiyon bölgesinde hafif reaksiyon bildirilmiştir
- Metotreksat ile hafif bulantı şikayeti (ilk haftalarda)

TAKİP VE MONİTORİZASYON
- 3 ayda bir romatoloji kontrolü
- Aylık CBC, karaciğer fonksiyon testleri
- 6 ayda bir göğüs röntgeni
- Sonraki randevu: 15/06/2024

YAŞAM TARZI ÖNERİLERİ
- Sigara ve alkol kullanımından kaçınılmalıdır
- Düzenli fizik tedavi ve egzersiz önerilmektedir
- Dengeli beslenme ve yeterli D vitamini alımı
- Enfeksiyon belirtilerine dikkat edilmeli

ACİL DURUM TALİMATLARI
- Yüksek ateş (>38.5°C), ciddi enfeksiyon bulguları veya şiddetli karın ağrısı durumunda acil servise başvurunuz
- Acil İletişim: 0212 414 20 00
`;

// Mock extracted JSON response
export const mockExtractedData = {
  title: "Huner Engine Medical Report Extractor v1.0",
  reportInformation: {
    reportNo: "2024-MR-789456",
    reportDate: "15/03/2024",
    protocolNo: "PRK-2024-123",
    reportType: "İlaç Kullanım Raporu",
    facility: {
      code: "11068743",
      title: "İstanbul Üniversitesi Tıp Fakültesi Hastanesi"
    }
  },
  patient: {
    demographic: {
      gender: "Erkek",
      dateOfBirth: "22/05/1978",
      age: 45
    },
    diagnoses: [
      {
        code: "M05.8",
        title: "Seropozitif romatoid artrit, diğer",
        description: "Hasta 4 yıldır romatoid artrit tanısıyla takip edilmektedir. Bilateral el ve ayak bilek eklemlerinde aktif sinovit mevcuttur.",
        startDate: "10/01/2020"
      },
      {
        code: "I10",
        title: "Esansiyel (primer) hipertansiyon",
        startDate: "05/03/2018"
      }
    ]
  },
  medicationInformation: [
    {
      activeIngredient: "Adalimumab",
      sgkCode: "8699514013105",
      brandName: "HUMIRA",
      form: "Subkutan enjeksiyon",
      dose: "40 mg",
      usage: {
        frequency: "2 haftada 1 kez",
        amount: "1 adet"
      },
      addedTime: "15/03/2024 09:30"
    },
    {
      activeIngredient: "Metotreksat",
      sgkCode: "8699504350142",
      form: "Oral tablet",
      dose: "15 mg/hafta",
      usage: {
        frequency: "Haftada 1 kez",
        amount: "6 tablet"
      },
      addedTime: "15/03/2024 09:35"
    },
    {
      activeIngredient: "Folik Asit",
      form: "Oral tablet",
      dose: "5 mg",
      usage: {
        frequency: "Haftada 1 kez",
        amount: "1 tablet"
      },
      addedTime: "15/03/2024 09:36"
    }
  ],
  doctors: [
    {
      fullName: "Dr. Ayşe Yılmaz",
      specialty: "Romatoloji",
      diplomaNo: "45678",
      registrationNo: "TR-ROM-2015-001"
    }
  ],
  findings: [
    {
      type: "Laboratuvar",
      value: "2.8 mg/L",
      description: "CRP (Normal: <5)",
      date: "10/03/2024"
    },
    {
      type: "Laboratuvar",
      value: "28 mm/saat",
      description: "ESH (Normal: <20)",
      date: "10/03/2024"
    },
    {
      type: "Laboratuvar",
      value: "156 IU/mL",
      description: "RF (Pozitif)",
      date: "10/03/2024"
    },
    {
      type: "Laboratuvar",
      value: "245 U/mL",
      description: "Anti-CCP (Yüksek pozitif)",
      date: "10/03/2024"
    },
    {
      type: "Laboratuvar",
      value: "24 U/L",
      description: "ALT (Normal)",
      date: "10/03/2024"
    },
    {
      type: "Laboratuvar",
      value: "0.9 mg/dL",
      description: "Kreatinin (Normal)",
      date: "10/03/2024"
    }
  ],
  notes: {
    clinicalSummary: "Hasta 2020 yılında romatoid artrit tanısı almış olup, başlangıçta konvansiyonel DMARD tedavisi (metotreksat) başlanmıştır. 2022 yılında hastalık aktivitesi artış gösterince adalimumab tedavisi eklenmiştir. Mevcut durumda DAS28-CRP skoru 3.2 olup orta hastalık aktivitesi mevcuttur. Tedaviye uyumu iyidir.",
    dosageDetails: "Adalimumab 40 mg subkutan, 2 haftada bir uygulama. Metotreksat 15 mg/hafta (6x2.5mg tablet), Cumartesi günü alınacak. Folik asit 5 mg, metotreksat alımından 24-48 saat sonra alınacak.",
    allergies: "Penisilin grubu antibiyotiklere alerji (ürtiker). Sulfonamid grubu ilaçlara hassasiyet.",
    contraindications: "Aktif enfeksiyon varlığında adalimumab kullanılmamalıdır. Canlı aşı uygulaması kontrendikedir. Metotreksat ile NSAİİ etkileşimi - dikkatli kullanılmalıdır.",
    sideEffects: "Adalimumab enjeksiyon bölgesinde hafif reaksiyon bildirilmiştir. Metotreksat ile hafif bulantı şikayeti (ilk haftalarda).",
    monitoring: "3 ayda bir romatoloji kontrolü. Aylık CBC, karaciğer fonksiyon testleri. 6 ayda bir göğüs röntgeni. Sonraki randevu: 15/06/2024",
    lifestyle: "Sigara ve alkol kullanımından kaçınılmalıdır. Düzenli fizik tedavi ve egzersiz önerilmektedir. Dengeli beslenme ve yeterli D vitamini alımı. Enfeksiyon belirtilerine dikkat edilmeli.",
    emergencyInstructions: "Yüksek ateş (>38.5°C), ciddi enfeksiyon bulguları veya şiddetli karın ağrısı durumunda acil servise başvurunuz. Acil İletişim: 0212 414 20 00"
  }
};

// Mock SUT compliance evaluation
export const mockSUTEvaluation = {
  medications: [
    {
      sgkCode: "8699514013105",
      activeIngredient: "Adalimumab",
      brandName: "HUMIRA",
      result: "Uygun",
      evaluation: "Romatoid artrit tanısı (M05.8) SUT kriterlerine uygun. Hasta en az 3 ay konvansiyonel DMARD tedavisi almış ve yanıt yetersiz kalmıştır. Biyolojik ajan kullanımı için gerekli koşullar sağlanmaktadır. DAS28 skoru 3.2 olup orta-yüksek hastalık aktivitesi mevcuttur.",
      sutReference: "SUT 4.2.14.C - Romatizmal Hastalıklarda Biyolojik İlaç Kullanımı",
      requiredDocs: ["Romatoloji uzman raporu", "DAS28 skoru belgesi", "Önceki tedavi yanıtsızlığı belgesi"]
    },
    {
      sgkCode: "8699504350142",
      activeIngredient: "Metotreksat",
      brandName: null,
      result: "Uygun",
      evaluation: "Romatoid artrit tedavisinde birinci basamak DMARD olarak metotreksat kullanımı SUT kapsamında onaylıdır. Haftalık 15 mg dozaj uygun aralıktadır.",
      sutReference: "SUT 4.2.14.A - Konvansiyonel DMARD Tedavisi",
      requiredDocs: ["Romatoloji uzman raporu"]
    },
    {
      sgkCode: null,
      activeIngredient: "Folik Asit",
      brandName: null,
      result: "Uygun",
      evaluation: "Metotreksat kullanımına bağlı folat eksikliğini önlemek için folik asit suplementasyonu SUT kapsamında desteklenmektedir.",
      sutReference: "SUT 4.2.14.A - Destek Tedavisi",
      requiredDocs: []
    }
  ],
  overallResult: "Uygun",
  summary: "Tüm reçete edilen ilaçlar SUT (Sağlık Uygulama Tebliği) kriterlerine uygundur. Romatoid artrit tanısı doğrulanmış olup, biyolojik ajan ve konvansiyonel DMARD kombinasyon tedavisi endikedir. Gerekli belgeler tamamlandığında SGK geri ödeme kapsamındadır.",
  warnings: [
    "Adalimumab için 3 aylık rapor süresi geçerlidir, rapor yenileme tarihi takip edilmelidir.",
    "Biyolojik tedavi başlamadan önce tüberküloz taraması yapılmalıdır."
  ]
};

