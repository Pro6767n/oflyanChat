import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const resources = {
  az: {translation: {
    appName:'oflyanChat',chats:'Söhbətlər',devices:'Cihazlar',settings:'Ayarlar',
    search:'Axtar...',typeMessage:'Mesaj yaz...',connecting:'Qoşulur...',
    connected:'Qoşuldu',disconnected:'Bağlantı kəsildi',availableDevices:'Mövcud cihazlar',
    pairedDevices:'Qoşulmuş cihazlar',scan:'Axtar',stopScan:'Dayandır',
    noDevices:'Cihaz tapılmadı',bluetoothOff:'Bluetooth söndürülüb',
    enableBluetooth:'Bluetooth-u aç',theme:'Tema',language:'Dil',
    light:'Açıq',dark:'Qaranlıq',system:'Sistem',appearance:'Görünüş',
    notifications:'Bildirişlər',about:'Haqqında',version:'Versiya 1.0.0',
    offlineChat:'Offline Mesajlaşma',offlineDesc:'Bluetooth ilə internet olmadan mesajlaşın',
    send:'Göndər',delivered:'Çatdırıldı',read:'Oxundu',today:'Bugün',
    yesterday:'Dünən',deleteChat:'Söhbəti sil',confirmDelete:'Bu söhbəti silmək istədiyinizə əminsiniz?',
    cancel:'Ləğv et',delete:'Sil',typing:'yazır...',online:'onlayn',offline:'oflayn'
  }},
  tr: {translation: {
    appName:'oflyanChat',chats:'Sohbetler',devices:'Cihazlar',settings:'Ayarlar',
    search:'Ara...',typeMessage:'Mesaj yaz...',connecting:'Bağlanıyor...',
    connected:'Bağlandı',disconnected:'Bağlantı kesildi',availableDevices:'Mevcut cihazlar',
    pairedDevices:'Eşleşmiş cihazlar',scan:'Tara',stopScan:'Durdur',
    noDevices:'Cihaz bulunamadı',bluetoothOff:'Bluetooth kapalı',
    enableBluetooth:'Bluetooth aç',theme:'Tema',language:'Dil',
    light:'Açık',dark:'Koyu',system:'Sistem',appearance:'Görünüm',
    notifications:'Bildirimler',about:'Hakkında',version:'Versiyon 1.0.0',
    offlineChat:'Offline Mesajlaşma',offlineDesc:'Bluetooth ile internet olmadan mesajlaşın',
    send:'Gönder',delivered:'Teslim edildi',read:'Okundu',today:'Bugün',
    yesterday:'Dün',deleteChat:'Sohbeti sil',confirmDelete:'Bu sohbeti silmek istediğinize emin misiniz?',
    cancel:'İptal',delete:'Sil',typing:'yazıyor...',online:'çevrimiçi',offline:'çevrimdışı'
  }},
  en: {translation: {
    appName:'oflyanChat',chats:'Chats',devices:'Devices',settings:'Settings',
    search:'Search...',typeMessage:'Type a message...',connecting:'Connecting...',
    connected:'Connected',disconnected:'Disconnected',availableDevices:'Available devices',
    pairedDevices:'Paired devices',scan:'Scan',stopScan:'Stop',
    noDevices:'No devices found',bluetoothOff:'Bluetooth is off',
    enableBluetooth:'Enable Bluetooth',theme:'Theme',language:'Language',
    light:'Light',dark:'Dark',system:'System',appearance:'Appearance',
    notifications:'Notifications',about:'About',version:'Version 1.0.0',
    offlineChat:'Offline Chat',offlineDesc:'Chat without internet using Bluetooth',
    send:'Send',delivered:'Delivered',read:'Read',today:'Today',
    yesterday:'Yesterday',deleteChat:'Delete chat',confirmDelete:'Are you sure you want to delete this chat?',
    cancel:'Cancel',delete:'Delete',typing:'typing...',online:'online',offline:'offline'
  }},
};

const fallback = {languageTag:'az',isRTL:false};
const {languageTag} = RNLocalize.findBestLanguageTag(Object.keys(resources)) || fallback;

i18n.use(initReactI18next).init({
  resources, lng: languageTag, fallbackLng: 'az',
  interpolation: {escapeValue: false},
});

export default i18n;
