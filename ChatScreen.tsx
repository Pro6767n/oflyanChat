import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import BluetoothService from './BluetoothService';
import {useTheme} from './ThemeContext';
import {Message} from './types';
import ChatBubble from './ChatBubble';

const ChatScreen: React.FC = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {deviceAddress, deviceName} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages(); checkConnection();
    const unsubMsg = BluetoothService.onMessage(msg => { if (msg.deviceAddress === deviceAddress) { saveMessage(msg); setMessages(prev => [...prev, msg]); } });
    const unsubConn = BluetoothService.onConnectionChange((isConnected, device) => { if (device?.address === deviceAddress) setConnected(isConnected); });
    return () => { unsubMsg(); unsubConn(); };
  }, [deviceAddress]);

  const loadMessages = async () => {
    try { const stored = await AsyncStorage.getItem(`chat_${deviceAddress}`); if (stored) setMessages(JSON.parse(stored)); } catch (e) { console.error('Load messages error:', e); }
  };

  const saveMessage = async (msg: Message) => {
    try { const stored = await AsyncStorage.getItem(`chat_${deviceAddress}`); const msgs: Message[] = stored ? JSON.parse(stored) : []; msgs.push(msg); await AsyncStorage.setItem(`chat_${deviceAddress}`, JSON.stringify(msgs)); } catch (e) { console.error('Save message error:', e); }
  };

  const checkConnection = async () => { const device = BluetoothService.getConnectedDevice(); if (device?.address === deviceAddress) setConnected(true); };

  const handleConnect = async () => {
    setConnecting(true);
    const success = await BluetoothService.connectToDevice(deviceAddress);
    setConnecting(false); setConnected(success);
    if (!success) Alert.alert('Error', 'Could not connect');
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    if (!connected) { Alert.alert('Offline', 'Not connected to device'); return; }
    const msg: Message = {id: uuidv4(), text: inputText.trim(), sender: 'me', timestamp: Date.now(), deviceAddress, status: 'sending'};
    setMessages(prev => [...prev, msg]); setInputText('');
    const success = await BluetoothService.sendMessage(msg.text, deviceAddress);
    const updatedMsg = {...msg, status: success ? 'delivered' : 'failed'};
    setMessages(prev => prev.map(m => (m.id === msg.id ? updatedMsg : m)));
    await saveMessage(updatedMsg);
  };

  const renderMessage = useCallback(({item}: {item: Message}) => <ChatBubble message={item} />, []);

  const renderDateSeparator = (timestamp: number) => {
    const date = new Date(timestamp); const today = new Date(); const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    let label = date.toLocaleDateString();
    if (date.toDateString() === today.toDateString()) label = t('today');
    else if (date.toDateString() === yesterday.toDateString()) label = t('yesterday');
    return (
      <View style={styles.dateContainer}>
        <View style={[styles.dateBadge, {backgroundColor: colors.surface}]}>
          <Text style={[styles.dateText, {color: colors.textSecondary}]}>{label}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={[styles.container, {backgroundColor: colors.chatBackground}]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{deviceName}</Text>
          <Text style={styles.headerStatus}>{connecting ? t('connecting') : connected ? t('online') : t('offline')}</Text>
        </View>
        {!connected && !connecting && <TouchableOpacity onPress={handleConnect}><Icon name="bluetooth" size={24} color="#fff" /></TouchableOpacity>}
        {connecting && <ActivityIndicator size="small" color="#fff" />}
      </View>
      <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id} renderItem={renderMessage} contentContainerStyle={styles.messagesList} onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})} ListHeaderComponent={messages.length > 0 ? renderDateSeparator(messages[0].timestamp) : null} />
      <View style={[styles.inputContainer, {backgroundColor: colors.background, borderTopColor: colors.border}]}>
        <View style={[styles.inputWrapper, {backgroundColor: colors.surface}]}>
          <TextInput style={[styles.input, {color: colors.text}]} placeholder={t('typeMessage')} placeholderTextColor={colors.textSecondary} value={inputText} onChangeText={setInputText} multiline maxLength={1000} />
        </View>
        <TouchableOpacity style={[styles.sendButton, {backgroundColor: colors.accent}]} onPress={handleSend}><Icon name="send" size={24} color="#fff" /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 50, paddingBottom: 12, gap: 12},
  headerInfo: {flex: 1},
  headerName: {fontSize: 16, fontWeight: '600', color: '#fff'},
  headerStatus: {fontSize: 12, color: 'rgba(255,255,255,0.7)'},
  messagesList: {paddingVertical: 8},
  dateContainer: {alignItems: 'center', marginVertical: 8},
  dateBadge: {paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12},
  dateText: {fontSize: 12, fontWeight: '500'},
  inputContainer: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, borderTopWidth: 1},
  inputWrapper: {flex: 1, borderRadius: 24, paddingHorizontal: 16, maxHeight: 120, marginRight: 8},
  input: {fontSize: 16, paddingVertical: 10, maxHeight: 120},
  sendButton: {width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center'},
});

export default ChatScreen;
