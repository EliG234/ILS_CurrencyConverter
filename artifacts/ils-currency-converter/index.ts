import 'expo-router/entry';

import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  require('./widgets/android/widget-task-handler');
}