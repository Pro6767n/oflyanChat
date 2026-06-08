import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from './ThemeContext';
import {Chat, Message} from './types';
import ChatListItem from './ChatListItem';

const ChatsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation<any>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadChats = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const chatKeys = keys.filter(k => k.startsWith('chat_'));
      const loadedChats: Chat[] = [];
      for (const key of chatKeys) {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          const messages: Message[] = JSON.parse(stored);
          if (messages.length > 0) {
            const address = key.replace('chat_', '');
            const deviceName = messages[0].deviceName || address;
            loadedChats.push({deviceAddress: address, deviceName, messages, lastMessageAt: messages[messages.length - 1].timestamp, unreadCount: 0});
          }
        }
      }
      loadedChats.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      setChats(loadedChats);
    } catch (e) { console.error('Load chats error:', e); }
  };

  useFocusEffect(useCallback(() => { loadChats(); }, []));

  const onRefresh = useCallback(async () => { setRefreshing(true); await loadChats(); setRefreshing(false); }, []);

  const handleDeleteChat = (chat: Chat) => {
    Alert.alert(t('deleteChat'), t('confirmDelete'), [
      {text: t('cancel'), style: 'cancel'},
      {text: t('delete'), style: 'destructive', onPress: async () => { await AsyncStorage.removeItem(`chat_${chat.deviceAddress}`); loadChats(); }},
    ]);
  };

  const handleChatPress = (chat: Chat) => {
    navigation.navigate('Chat', {deviceAddress: chat.deviceAddress, deviceName: chat.deviceName});
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <Text style={styles.headerTitle}>{t('appName')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Devices')} style={styles.newChatButton}>
          <Icon name="chat" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        keyExtractor={item => item.deviceAddress}
        renderItem={({item}) => <ChatListItem chat={item} onPress={() => handleChatPress(item)} onLongPress={() => handleDeleteChat(item)} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="chat-bubble-outline" size={80} color={colors.border} />
            <Text style={[styles.emptyTitle, {color: colors.text}]}>{t('offlineChat')}</Text>
            <Text style={[styles.emptyDesc, {color: colors.textSecondary}]}>{t('offlineDesc')}</Text>
            <TouchableOpacity style={[styles.startButton, {backgroundColor: colors.accent}]} onPress={() => navigation.navigate('Devices')}>
              <Text style={styles.startButtonText}>{t('devices')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16},
  headerTitle: {fontSize: 20, fontWeight: 'bold', color: '#fff'},
  newChatButton: {padding: 8},
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 120, paddingHorizontal: 32},
  emptyTitle: {fontSize: 22, fontWeight: 'bold', marginTop: 24},
  emptyDesc: {fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22},
  startButton: {marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24},
  startButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default ChatsScreen;
