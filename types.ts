export interface Device {
  address: string;
  name: string;
  bonded?: boolean;
  connected?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: number;
  deviceAddress: string;
  status: 'sending' | 'sent' | 'delivered' | 'failed';
}

export interface Chat {
  deviceAddress: string;
  deviceName: string;
  messages: Message[];
  lastMessageAt: number;
  unreadCount: number;
}

export type ThemeType = 'light' | 'dark' | 'system';
export type LanguageType = 'az' | 'tr' | 'en';
