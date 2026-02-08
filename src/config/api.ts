import { Platform } from 'react-native';

// Tu IP local real para probar la API
const LOCAL_IP = '192.168.68.107';

export const API_URL = Platform.select({
  ios: `http://${LOCAL_IP}:3000`,
  android: `http://${LOCAL_IP}:3000`,
});
