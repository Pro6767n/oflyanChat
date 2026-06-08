import {Platform, PermissionsAndroid} from 'react-native';

export async function requestBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  try {
    if (Platform.Version >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);
      return (
        results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else if (Platform.Version >= 23) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {title: 'Konum İzni Gerekli', message: 'Yakındaki Bluetooth cihazlarını bulabilmek için konum izni gereklidir.', buttonNeutral: 'Sonra Sor', buttonNegative: 'İptal', buttonPositive: 'Tamam'},
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) { console.warn('Permission error:', err); return false; }
}
