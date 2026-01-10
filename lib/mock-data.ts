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
1. Gastroözofageal Reflü Hastalığı (K21.9)
   Başlangıç: 10/01/2024
   Tanı açıklaması: Kronik GÖRH tanısı ile takipli hasta

2. Hipertansiyon (I10) - Esansiyel (primer) hipertansiyon
   Başlangıç: 05/03/2018

3. Tip 2 Diabetes Mellitus (E11.9)
   Başlangıç: 01/06/2022

REÇETE EDİLEN İLAÇLAR
1. Esomeprazol 40 mg Tablet
   SGK Kodu: SGKEZY
   Form: Oral tablet
   Doz: 40 mg
   Kullanım: Günde 1 kez
   Ekleme Tarihi: 15/03/2024 09:30

2. Valsartan/Amlodipin 160/10 mg Tablet
   SGK Kodu: SGKG72
   Form: Oral tablet
   Doz: 160/10 mg
   Kullanım: Günde 1 kez
   Ekleme Tarihi: 15/03/2024 09:35

3. Tirzepatid 5 mg Enjeksiyon
   SGK Kodu: SGKTRZ
   Form: Subkutan enjeksiyon
   Doz: 5 mg
   Kullanım: Haftada 1 kez
   Ekleme Tarihi: 15/03/2024 09:40

HEKİM BİLGİLERİ
Dr. Mehmet Yıldırım
Uzmanlık: İç Hastalıkları
Diploma No: 34567
Sicil No: TR-ICH-2012-045

KLİNİK ÖZET
Hasta kronik GÖRH, hipertansiyon ve Tip 2 DM tanıları ile takip edilmektedir. Mevcut tedavi ile semptomlar kontrol altındadır.
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
        code: "K21.9",
        title: "Gastroözofageal reflü hastalığı",
        description: "Kronik GÖRH tanısı ile takipli hasta",
        startDate: "10/01/2024"
      },
      {
        code: "I10",
        title: "Esansiyel (primer) hipertansiyon",
        startDate: "05/03/2018"
      },
      {
        code: "E11.9",
        title: "Tip 2 diabetes mellitus",
        startDate: "01/06/2022"
      }
    ]
  },
  medicationInformation: [
    {
      activeIngredient: "Esomeprazol",
      sgkCode: "SGKEZY",
      form: "Oral tablet",
      dose: "40 mg",
      usage: {
        frequency: "Günde 1 kez",
        amount: "1 tablet"
      },
      addedTime: "15/03/2024 09:30"
    },
    {
      activeIngredient: "Valsartan/Amlodipin",
      sgkCode: "SGKG72",
      form: "Oral tablet",
      dose: "160/10 mg",
      usage: {
        frequency: "Günde 1 kez",
        amount: "1 tablet"
      },
      addedTime: "15/03/2024 09:35"
    },
    {
      activeIngredient: "Tirzepatid",
      sgkCode: "SGKTRZ",
      form: "Subkutan enjeksiyon",
      dose: "5 mg",
      usage: {
        frequency: "Haftada 1 kez",
        amount: "1 enjeksiyon"
      },
      addedTime: "15/03/2024 09:40"
    }
  ],
  doctors: [
    {
      fullName: "Dr. Mehmet Yıldırım",
      specialty: "İç Hastalıkları",
      diplomaNo: "34567",
      registrationNo: "TR-ICH-2012-045"
    }
  ],
  findings: [],
  notes: {
    clinicalSummary: "Hasta kronik GÖRH, hipertansiyon ve Tip 2 DM tanıları ile takip edilmektedir. Mevcut tedavi ile semptomlar kontrol altındadır."
  }
};

// Mock SUT compliance evaluation - Updated format with "Bulunamadı" example
export const mockSUTEvaluation = {
  medications: [
    {
      id: "eval-1",
      sgkCode: "SGKEZY",
      activeIngredient: "Esomeprazol",
      result: "Uygun" as const,
      evaluation: "İlaç, EK-4/D listesinde yer almayan hastalıklar (20.00) tanı kodu ile verilmiştir. Tanı (K21.9) ve uzmanlık branşı (İç Hastalıkları) uygundur.",
      diagnosisCode: "K21.9",
      specialty: "İç Hastalıkları",
      sutReference: "EK-4/D - Bedeli Ödenecek İlaçlar Listesi"
    },
    {
      id: "eval-2",
      sgkCode: "SGKG72",
      activeIngredient: "Valsartan/Amlodipin",
      result: "Uygun Değil" as const,
      evaluation: "EK-4F Madde 51'e göre, anjiyotensin reseptör blokerlerinin diğer antihipertansifler ile kombinasyonlarının kullanımında, hastanın monoterapi ile kan basıncının yeterli oranda kontrol altına alınamadığının raporda belirtilmesi zorunludur.",
      diagnosisCode: "I10",
      specialty: "İç Hastalıkları",
      sutReference: "EK-4F Madde 51 - Antihipertansif Kombinasyonlar"
    },
    {
      id: "eval-3",
      sgkCode: "SGKTRZ",
      activeIngredient: "Tirzepatid",
      result: "Bulunamadı" as const,
      evaluation: "Bu etken madde SUT veritabanında bulunamadı. Lütfen etken maddeyi sisteme ekleyin.",
      diagnosisCode: "E11.9",
      specialty: "İç Hastalıkları"
    }
  ],
  overallResult: "Uygun Değil" as const,
  summary: "Reçetedeki ilaçlardan biri SUT kriterlerini karşılamamaktadır ve bir etken madde sistemde bulunamadı. Eksik etken maddeler için SUT yönetim panelinden ekleme yapılması gerekmektedir.",
  timestamp: new Date().toISOString()
};

// SUT Management URL for adding new ingredients
export const SUT_MANAGEMENT_URL = "https://hunerai.com/admin/sut-management";
