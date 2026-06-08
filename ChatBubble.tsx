import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from './ThemeContext';
import {Message} from './types';

interface Props { message: Message; }

const ChatBubble: React.FC<Props> = ({message}) => {
  const {colors} = useTheme();
  const isMe = message.sender === 'me';
  const time = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

  return (
    <View style={[styles.container, isMe ? styles.sentContainer : styles.receivedContainer]}>
      <View style={[styles.bubble, {
        backgroundColor: isMe ? colors.sentBubble : colors.receivedBubble,
        borderBottomRightRadius: isMe ? 4 : 16, borderBottomLeftRadius: isMe ? 16 : 4,
      }]}>
        <Text style={[styles.text, {color: colors.text}]}>{message.text}</Text>
        <View style={styles.footer}>
          <Text style={[styles.time, {color: colors.textSecondary}]}>{time}</Text>
          {isMe && (
            <Icon name={message.status === 'read' ? 'done-all' : message.status === 'delivered' ? 'done-all' : 'done'}
              size={14} color={message.status === 'read' ? '#34B7F1' : colors.textSecondary} style={styles.statusIcon} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginVertical: 2, paddingHorizontal: 8, maxWidth: '80%'},
  sentContainer: {alignSelf: 'flex-end'},
  receivedContainer: {alignSelf: 'flex-start'},
  bubble: {padding: 10, borderRadius: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16},
  text: {fontSize: 15, lineHeight: 20},
  footer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4},
  time: {fontSize: 11},
  statusIcon: {marginLeft: 4},
});

export default ChatBubble;
