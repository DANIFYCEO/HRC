// Maps integration utilities

import { Linking, Alert, Platform } from 'react-native';
import { Contacts } from '../constants/Contacts';

/**
 * Open maps app with church location
 */
export const openChurchLocation = async (): Promise<boolean> => {
  try {
    const { latitude, longitude } = Contacts.churchCoordinates;
    const address = encodeURIComponent(Contacts.churchAddress);

    // Different URLs for iOS and Android
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${latitude},${longitude}(${address})`,
      default: `https://www.google.com/maps/search/?api=1&query=${address}`,
    });

    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      // Fallback to Google Maps web
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
      await Linking.openURL(webUrl);
      return true;
    }

    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Error opening maps:', error);
    Alert.alert(
      'Error',
      'Unable to open maps. Please try again.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

/**
 * Get directions to church
 */
export const getDirectionsToChurch = async (): Promise<boolean> => {
  try {
    const { latitude, longitude } = Contacts.churchCoordinates;

    const url = Platform.select({
      ios: `maps:?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Error getting directions:', error);
    return openChurchLocation(); // Fallback to just opening location
  }
};
