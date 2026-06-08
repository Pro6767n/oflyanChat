import RNBluetoothClassic, {BluetoothDevice, BluetoothDeviceReadEvent} from 'react-native-bluetooth-classic';
import {Device, Message} from './types';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

class BluetoothService {
  private static instance: BluetoothService;
  private connectedDevice: BluetoothDevice | null = null;
  private dataListener: any = null;
  private discoveryListener: any = null;
  private onMessageCallbacks: ((msg: Message) => void)[] = [];
  private onDeviceFoundCallbacks: ((device: Device) => void)[] = [];
  private onConnectionChangeCallbacks: ((connected: boolean, device?: Device) => void)[] = [];
  private isAccepting = false;

  static getInstance(): BluetoothService {
    if (!BluetoothService.instance) BluetoothService.instance = new BluetoothService();
    return BluetoothService.instance;
  }

  async isEnabled(): Promise<boolean> {
    try { return await RNBluetoothClassic.isEnabled(); } catch { return false; }
  }

  async requestEnable(): Promise<boolean> {
    try { return await RNBluetoothClassic.requestBluetoothEnabled(); } catch { return false; }
  }

  async getBondedDevices(): Promise<Device[]> {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      return devices.map(d => this.mapDevice(d));
    } catch { return []; }
  }

  async startDiscovery(): Promise<void> {
    try {
      await RNBluetoothClassic.startDiscovery();
      this.discoveryListener = RNBluetoothClassic.onDeviceFound((device: BluetoothDevice) => {
        const mapped = this.mapDevice(device);
        this.onDeviceFoundCallbacks.forEach(cb => cb(mapped));
      });
    } catch (e) { console.error('Discovery error:', e); }
  }

  async stopDiscovery(): Promise<void> {
    try {
      await RNBluetoothClassic.cancelDiscovery();
      if (this.discoveryListener) { this.discoveryListener.remove(); this.discoveryListener = null; }
    } catch (e) { console.error('Stop discovery error:', e); }
  }

  async connectToDevice(address: string): Promise<boolean> {
    try {
      const device = await RNBluetoothClassic.connectToDevice(address, {delimiter: '\n'});
      if (device) {
        this.connectedDevice = device;
        this.setupDataListener();
        this.notifyConnectionChange(true, this.mapDevice(device));
        return true;
      }
      return false;
    } catch (e) { console.error('Connect error:', e); return false; }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice) await this.connectedDevice.disconnect();
      if (this.dataListener) { this.dataListener.remove(); this.dataListener = null; }
      this.connectedDevice = null;
      this.notifyConnectionChange(false);
    } catch (e) { console.error('Disconnect error:', e); }
  }

  async sendMessage(text: string, deviceAddress: string): Promise<boolean> {
    try {
      const message = JSON.stringify({type: 'message', id: uuidv4(), text, timestamp: Date.now()}) + '\n';
      if (this.connectedDevice && this.connectedDevice.address === deviceAddress) {
        await this.connectedDevice.write(message);
        return true;
      }
      return false;
    } catch (e) { console.error('Send error:', e); return false; }
  }

  async acceptConnections(): Promise<void> {
    if (this.isAccepting) return;
    this.isAccepting = true;
    try {
      await RNBluetoothClassic.accept({delimiter: '\n'}).then((device: BluetoothDevice) => {
        if (device) {
          this.connectedDevice = device;
          this.setupDataListener();
          this.notifyConnectionChange(true, this.mapDevice(device));
        }
      });
    } catch (e) { console.error('Accept error:', e); } finally { this.isAccepting = false; }
  }

  private setupDataListener() {
    if (this.dataListener) this.dataListener.remove();
    this.dataListener = RNBluetoothClassic.onDeviceRead(this.connectedDevice!.address, (event: BluetoothDeviceReadEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          const msg: Message = {id: data.id || uuidv4(), text: data.text, sender: 'other', timestamp: data.timestamp || Date.now(), deviceAddress: this.connectedDevice?.address || '', status: 'delivered'};
          this.onMessageCallbacks.forEach(cb => cb(msg));
        }
      } catch {
        const msg: Message = {id: uuidv4(), text: event.data, sender: 'other', timestamp: Date.now(), deviceAddress: this.connectedDevice?.address || '', status: 'delivered'};
        this.onMessageCallbacks.forEach(cb => cb(msg));
      }
    });
  }

  private mapDevice(device: BluetoothDevice): Device {
    return {address: device.address, name: device.name || device.address, bonded: device.bonded, connected: device.connected};
  }

  onMessage(callback: (msg: Message) => void) {
    this.onMessageCallbacks.push(callback);
    return () => { this.onMessageCallbacks = this.onMessageCallbacks.filter(cb => cb !== callback); };
  }

  onDeviceFound(callback: (device: Device) => void) {
    this.onDeviceFoundCallbacks.push(callback);
    return () => { this.onDeviceFoundCallbacks = this.onDeviceFoundCallbacks.filter(cb => cb !== callback); };
  }

  onConnectionChange(callback: (connected: boolean, device?: Device) => void) {
    this.onConnectionChangeCallbacks.push(callback);
    return () => { this.onConnectionChangeCallbacks = this.onConnectionChangeCallbacks.filter(cb => cb !== callback); };
  }

  private notifyConnectionChange(connected: boolean, device?: Device) {
    this.onConnectionChangeCallbacks.forEach(cb => cb(connected, device));
  }

  getConnectedDevice(): Device | null {
    return this.connectedDevice ? this.mapDevice(this.connectedDevice) : null;
  }
}

export default BluetoothService.getInstance();
