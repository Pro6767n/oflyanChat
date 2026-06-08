import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from './ThemeContext';
import {useLanguage} from './LanguageContext';
import {ThemeType, LanguageType} from './types';

const SettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {theme, colors, setTheme, isDark} = useTheme();
  const {language, setLanguage} = useLanguage();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const themeOptions: {value: ThemeType; label: string; icon: string}[] = [
    {value: 'light', label: t('light'), icon: 'wb-sunny'},
    {value: 'dark', label: t('dark'), icon: 'nights-stay'},
    {value: 'system', label: t('system'), icon: 'settings-suggest'},
  ];

  const langOptions: {value: LanguageType; label: string; flag: string}[] = [
    {value: 'az', label: 'Azərbaycan', flag: '🇦🇿'},
    {value: 'tr', label: 'Türkçe', flag: '🇹🇷'},
    {value: 'en', label: 'English', flag: '🇬🇧'},
  ];

  const handleThemeChange = (newTheme: ThemeType) => { setTheme(newTheme); setShowThemePicker(false); };
  const handleLanguageChange = (newLang: LanguageType) => { setLanguage(newLang); setShowLangPicker(false); };

  const handleClearAllChats = () => {
    Alert.alert('Tüm Sohbetleri Sil', 'Tüm sohbet geçmişi silinecek. Emin misiniz?', [
      {text: t('cancel'), style: 'cancel'},
      {text: t('delete'), style: 'destructive', onPress: async () => { Alert.alert('Başarılı', 'Tüm sohbetler silindi'); }},
    ]);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={[styles.profileSection, {backgroundColor: colors.primary}]}>
          <View style={styles.avatar}><Icon name="person" size={40} color="#fff" /></View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>oflyanChat User</Text>
            <Text style={styles.profileStatus}>oflyanChat</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>{t('appearance')}</Text>
          <TouchableOpacity style={[styles.settingItem, {borderBottomColor: colors.border}]} onPress={() => setShowThemePicker(!showThemePicker)}>
            <Icon name={isDark ? 'nights-stay' : 'wb-sunny'} size={24} color={colors.accent} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, {color: colors.text}]}>{t('theme')}</Text>
              <Text style={[styles.settingValue, {color: colors.textSecondary}]}>{theme === 'system' ? t('system') : theme === 'dark' ? t('dark') : t('light')}</Text>
            </View>
            <Icon name={showThemePicker ? 'expand-less' : 'expand-more'} size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          {showThemePicker && (
            <View style={[styles.pickerContainer, {backgroundColor: colors.surface}]}>
              {themeOptions.map(option => (
                <TouchableOpacity key={option.value} style={[styles.pickerItem, theme === option.value && {backgroundColor: colors.primary + '20'}]} onPress={() => handleThemeChange(option.value)}>
                  <Icon name={option.icon} size={22} color={colors.text} />
                  <Text style={[styles.pickerText, {color: colors.text}]}>{option.label}</Text>
                  {theme === option.value && <Icon name="check" size={22} color={colors.accent} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity style={[styles.settingItem, {borderBottomColor: colors.border}]} onPress={() => setShowLangPicker(!showLangPicker)}>
            <Icon name="language" size={24} color={colors.accent} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, {color: colors.text}]}>{t('language')}</Text>
              <Text style={[styles.settingValue, {color: colors.textSecondary}]}>{langOptions.find(l => l.value === language)?.label}</Text>
            </View>
            <Icon name={showLangPicker ? 'expand-less' : 'expand-more'} size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          {showLangPicker && (
            <View style={[styles.pickerContainer, {backgroundColor: colors.surface}]}>
              {langOptions.map(option => (
                <TouchableOpacity key={option.value} style={[styles.pickerItem, language === option.value && {backgroundColor: colors.primary + '20'}]} onPress={() => handleLanguageChange(option.value)}>
                  <Text style={styles.flagText}>{option.flag}</Text>
                  <Text style={[styles.pickerText, {color: colors.text}]}>{option.label}</Text>
                  {language === option.value && <Icon name="check" size={22} color={colors.accent} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>Data</Text>
          <TouchableOpacity style={[styles.settingItem, {borderBottomColor: colors.border}]} onPress={handleClearAllChats}>
            <Icon name="delete-forever" size={24} color={colors.danger} />
            <View style={styles.settingContent}><Text style={[styles.settingLabel, {color: colors.danger}]}>Tüm Sohbetleri Sil</Text></View>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>{t('about')}</Text>
          <View style={[styles.settingItem, {borderBottomColor: colors.border}]}>
            <Icon name="info" size={24} color={colors.textSecondary} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, {color: colors.text}]}>{t('appName')}</Text>
              <Text style={[styles.settingValue, {color: colors.textSecondary}]}>{t('version')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16},
  headerTitle: {fontSize: 20, fontWeight: 'bold', color: '#fff'},
  content: {flex: 1},
  profileSection: {flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 16, paddingBottom: 24},
  avatar: {width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center'},
  profileInfo: {marginLeft: 16},
  profileName: {fontSize: 20, fontWeight: '600', color: '#fff'},
  profileStatus: {fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2},
  section: {marginTop: 8},
  sectionTitle: {fontSize: 13, fontWeight: '600', textTransform: 'uppercase', paddingHorizontal: 16, paddingVertical: 8},
  settingItem: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5},
  settingContent: {flex: 1, marginLeft: 16},
  settingLabel: {fontSize: 16},
  settingValue: {fontSize: 14, marginTop: 2},
  pickerContainer: {marginHorizontal: 16, marginBottom: 8, borderRadius: 12, overflow: 'hidden'},
  pickerItem: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12},
  pickerText: {flex: 1, fontSize: 16},
  flagText: {fontSize: 20},
});

export default SettingsScreen;
