import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BluetoothService from './BluetoothService';
import {useTheme} from './ThemeContext';
import {Device} from './types';

const DevicesScreen: React.FC = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation<any>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  useEffect(() => {
    checkBluetooth();
    loadBondedDevices();
    const unsubFound = BluetoothService.onDeviceFound(device => {
      setDevices(prev => { if (prev.find(d => d.address === device.address)) return prev; return [...prev, device]; });
    });
    return () => { unsubFound(); if (scanning) BluetoothService.stopDiscovery(); };
  }, []);

  const checkBluetooth = async () => { setBluetoothEnabled(await BluetoothService.isEnabled()); };
  const loadBondedDevices = async () => { setDevices(await BluetoothService.getBondedDevices()); };

  const handleScan = async () => {
    if (!bluetoothEnabled) {
      const enabled = await BluetoothService.requestEnable();
      if (!enabled) { Alert.alert(t('bluetoothOff'), t('enableBluetooth')); return; }
      setBluetoothEnabled(true);
    }
    setScanning(true); setDevices([]);
    await BluetoothService.startDiscovery();
    setTimeout(async () => { await BluetoothService.stopDiscovery(); setScanning(false); }, 15000);
  };

  const handleStopScan = async () => { await BluetoothService.stopDiscovery(); setScanning(false); };

  const handleConnect = async (device: Device) => {
    const success = await BluetoothService.connectToDevice(device.address);
    if (success) { navigation.navigate('Chat', {deviceAddress: device.address, deviceName: device.name}); }
    else { Alert.alert('Error', 'Could not connect to device'); }
  };

  const onRefresh = useCallback(async () => { setRefreshing(true); await loadBondedDevices(); setRefreshing(false); }, []);

  const renderDevice = ({item}: {item: Device}) => (
    <TouchableOpacity style={[styles.deviceItem, {borderBottomColor: colors.border}]} onPress={() => handleConnect(item)}>
      <View style={[styles.iconContainer, {backgroundColor: colors.surface}]}>
        <Icon name="bluetooth" size={24} color={colors.primary} />
      </View>
      <View style={styles.deviceInfo}>
        <Text style={[styles.deviceName, {color: colors.text}]}>{item.name}</Text>
        <Text style={[styles.deviceAddress, {color: colors.textSecondary}]}>{item.address}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <Text style={styles.headerTitle}>{t('devices')}</Text>
        <TouchableOpacity style={styles.scanButton} onPress={scanning ? handleStopScan : handleScan}>
          <Icon name={scanning ? 'stop' : 'bluetooth-searching'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {scanning && (
        <View style={styles.scanningBar}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.scanningText, {color: colors.textSecondary}]}>{t('scan')}...</Text>
        </View>
      )}
      <FlatList
        data={devices}
        keyExtractor={item => item.address}
        renderItem={renderDevice}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bluetooth-disabled" size={64} color={colors.border} />
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>{t('noDevices')}</Text>
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
  scanButton: {padding: 8},
  scanningBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 8},
  scanningText: {fontSize: 14},
  deviceItem: {flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1},
  iconContainer: {width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12},
  deviceInfo: {flex: 1},
  deviceName: {fontSize: 16, fontWeight: '600'},
  deviceAddress: {fontSize: 13, marginTop: 2},
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100},
  emptyText: {marginTop: 16, fontSize: 16},
});

export default DevicesScreen;
