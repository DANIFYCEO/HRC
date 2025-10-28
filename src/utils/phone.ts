// Phone dialing utilities

import { Linking, Alert } from 'react-native';

/**
 * Open phone dialer with a number
 */
export const makePhoneCall = async (phoneNumber: string): Promise<boolean> => {
  try {
    const url = `tel:${phoneNumber}`;

    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert(
        'Cannot Make Call',
        'Your device does not support phone calls.',
        [{ text: 'OK' }]
      );
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Error making phone call:', error);
    Alert.alert(
      'Error',
      'Unable to open phone dialer. Please try again.',
      [{ text: 'OK' }]
    );
    return false;
  }
};
