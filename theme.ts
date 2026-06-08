export const Colors = {
  light: {
    primary: '#075E54', primaryDark: '#054d44', accent: '#25D366',
    background: '#FFFFFF', surface: '#F0F2F5', chatBackground: '#E5DDD5',
    text: '#111827', textSecondary: '#667781', sentBubble: '#DCF8C6',
    receivedBubble: '#FFFFFF', border: '#E9EDF0', statusBar: 'dark-content',
    icon: '#54656F', danger: '#FF3B30', warning: '#FF9500',
  },
  dark: {
    primary: '#0B141A', primaryDark: '#111B21', accent: '#00A884',
    background: '#0B141A', surface: '#111B21', chatBackground: '#0B141A',
    text: '#E9EDF0', textSecondary: '#8696A0', sentBubble: '#005C4B',
    receivedBubble: '#202C33', border: '#2A3942', statusBar: 'light-content',
    icon: '#AEBAC1', danger: '#FF453A', warning: '#FF9F0A',
  },
};

export type ColorScheme = typeof Colors.light;
