# oflyanChat 📱

**WhatsApp benzeri offline Bluetooth mesajlaşma uygulaması**

İnternet olmadan, sadece Bluetooth ile yakındaki cihazlarla mesajlaşın!

---

## 📱 TELEFONDA APK ALMA (Kompütersiz!)

### Adım 1: GitHub Hesabı Aç
- Telefonunda tarayıcı (Chrome/Safari) aç
- [github.com](https://github.com) adresine git
- **Sign up** ile ücretsiz hesap aç (2 dakika)

### Adım 2: Yeni Repo Oluştur
- Sağ üstte **+** işaretine tıkla → **New repository**
- İsim: `oflyanChat`
- **Public** seç
- **Create repository** de

### Adım 3: Dosyaları Yükle
- **Uploading an existing file** yazısına tıkla
- Bu ZIP'teki TÜM dosyaları seç ve yükle:
  - `src/` klasörü
  - `App.tsx`
  - `index.js`
  - `package.json`
  - `tsconfig.json`
  - `metro.config.js`
  - `babel.config.js`
  - `app.json`
  - `.github/workflows/build-apk.yml` (BU ÇOK ÖNEMLİ!)
- **Commit changes** de

### Adım 4: React Native Proje Yapısını Ekle
GitHub'da repo açıkken:
- **Add file** → **Create new file**
- Dosya adı: `android/app/build.gradle`
- İçeriği aşağıdaki gibi yap (veya bu dosyayı ZIP'ten çıkarıp yükle):

```gradle
// Bu dosya React Native CLI ile otomatik oluşur
// Eğer bu dosyayı elle yazmak istemiyorsan:
// 1. Bir arkadaşının bilgisayarında 'npx react-native init' yap
// 2. Sadece 'android/' klasörünü al
// 3. GitHub'a yükle
```

**Daha kolay yol:** Bir internet kafeye veya arkadaşının bilgisayarına git, orada:
```bash
npx react-native@latest init oflyanChat --template react-native-template-typescript
```
yap. Sadece `android/` ve `ios/` klasörlerini kopyala, telefonuna at, GitHub'a yükle.

### Adım 5: APK Build Et (GitHub otomatik yapacak!)
- GitHub repo sayfasında **Actions** sekmesine tıkla
- Sol tarafta **Build APK** workflow göreceksin
- Üzerine tıkla → **Run workflow** → **Run workflow** de
- 5-10 dakika bekle (GitHub ücretsiz sunucuda build ediyor)

### Adım 6: APK İndir
- Build bittikten sonra yeşil tik ✓ göreceksin
- Tıkla → En altta **Artifacts** bölümünde `oflyanChat-apk` göreceksin
- İndir!
- Telefonuna atıp kur

---

## 🚀 Daha Hızlı Yol: Arkadaşından Yardım İste

En kolay yol: Bir arkadaşının bilgisayarında (Windows/Mac) 15 dakika dur:

```bash
# 1. Proje indir
npx react-native@latest init oflyanChat --template react-native-template-typescript

# 2. ZIP'teki src/, App.tsx, package.json dosyalarını proje klasörüne kopyala

# 3. Bağımlılıkları yükle
cd oflyanChat
npm install

# 4. APK build et
cd android
./gradlew assembleRelease  # Mac/Linux
# veya
gradlew assembleRelease    # Windows

# 5. APK burada olacak:
# android/app/build/outputs/apk/release/app-release.apk
```

Bu APK'yı sana atsın, telefonuna kur!

---

## ⚠️ Önemli Notlar

### Android İzinleri (Telefonda)
Kurduktan sonra:
1. **Bluetooth** aç
2. Uygulama izin isteyince **İzin Ver** de
3. Android 12+ için: Konum, Bluetooth Scan, Bluetooth Connect izinleri gerekli

### Cihaz Eşleştirme
- İki telefon da **Bluetooth menüsünden birbirine eşleşmiş** olmalı
- Ayarlar → Bluetooth → Yeni cihaz eşleştir
- Sonra oflyanChat aç, cihazları bul, mesajlaş!

---

## 🛠️ Teknolojiler

- React Native 0.73
- TypeScript
- react-native-bluetooth-classic
- react-navigation
- i18next (AZ, TR, EN)

## 📂 Proje Yapısı

```
oflyanChat/
├── src/
│   ├── components/    # ChatBubble, ChatListItem
│   ├── context/       # ThemeContext, LanguageContext
│   ├── i18n/          # Çeviriler (AZ, TR, EN)
│   ├── screens/       # Chats, Chat, Devices, Settings
│   ├── services/      # BluetoothService
│   ├── theme/         # Light/Dark renkler
│   ├── types/         # TypeScript tipleri
│   └── utils/         # İzin yönetimi
├── App.tsx
├── package.json
└── .github/workflows/ # Otomatik APK build
```

## 🎨 Özellikler

- ✅ WhatsApp benzeri arayüz
- ✅ Bluetooth Classic ile çalışır (internet yok!)
- ✅ Açık/Koyu tema
- ✅ 3 dil desteği
- ✅ Mesaj geçmişi
- ✅ Gönderildi/Okundu ikonları

## 📞 Yardım

Sorun yaşarsan bana yaz! 🚀
