import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from './ThemeContext';
import {Chat} from './types';

interface Props { chat: Chat; onPress: () => void; onLongPress: () => void; }

const ChatListItem: React.FC<Props> = ({chat, onPress, onLongPress}) => {
  const {colors} = useTheme();
  const lastMsg = chat.messages[chat.messages.length - 1];
  const time = lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '';

  return (
    <TouchableOpacity style={[styles.container, {borderBottomColor: colors.border}]} onPress={onPress} onLongPress={onLongPress}>
      <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
        <Text style={styles.avatarText}>{chat.deviceName.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, {color: colors.text}]} numberOfLines={1}>{chat.deviceName}</Text>
          <Text style={[styles.time, {color: colors.textSecondary}]}>{time}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.message, {color: colors.textSecondary}]} numberOfLines={1}>{lastMsg ? lastMsg.text : 'No messages'}</Text>
          {chat.unreadCount > 0 && (
            <View style={[styles.badge, {backgroundColor: colors.accent}]}>
              <Text style={styles.badgeText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 0.5},
  avatar: {width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 12},
  avatarText: {fontSize: 22, fontWeight: 'bold', color: '#fff'},
  content: {flex: 1},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4},
  name: {fontSize: 16, fontWeight: '600', flex: 1},
  time: {fontSize: 12},
  footer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  message: {fontSize: 14, flex: 1},
  badge: {minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6},
  badgeText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
});

export default ChatListItem;
