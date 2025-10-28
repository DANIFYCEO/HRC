// App sharing utilities

import { Share, Alert } from 'react-native';
import { Contacts, getShareMessage } from '../constants/Contacts';

/**
 * Share the app with others
 */
export const shareApp = async (): Promise<boolean> => {
  try {
    const message = getShareMessage();

    const result = await Share.share({
      message,
      title: 'He Reigns Chapel App',
    });

    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Error sharing app:', error);
    Alert.alert(
      'Error',
      'Unable to share the app. Please try again.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

/**
 * Share custom content
 */
export const shareContent = async (
  title: string,
  message: string
): Promise<boolean> => {
  try {
    const result = await Share.share({
      message,
      title,
    });

    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Error sharing content:', error);
    return false;
  }
};
