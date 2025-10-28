// WhatsApp integration utilities

import { Linking, Alert } from 'react-native';
import { Contacts } from '../constants/Contacts';

/**
 * Open WhatsApp with a pre-filled message
 */
export const openWhatsApp = async (phone: string, message: string): Promise<boolean> => {
  try {
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

    // Check if WhatsApp is installed
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert(
        'WhatsApp Not Installed',
        'Please install WhatsApp to send messages.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // Open WhatsApp
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    Alert.alert(
      'Error',
      'Unable to open WhatsApp. Please try again.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

/**
 * Send prayer request to pastor via WhatsApp
 */
export const sendPrayerRequest = async (
  name: string,
  request: string,
  contact?: string,
  urgency: 'routine' | 'urgent' = 'routine'
): Promise<boolean> => {
  const message = formatPrayerRequestMessage(name, request, contact, urgency);
  return openWhatsApp(Contacts.pastorWhatsApp, message);
};

/**
 * Format prayer request message
 */
export const formatPrayerRequestMessage = (
  name: string,
  request: string,
  contact?: string,
  urgency: 'routine' | 'urgent' = 'routine'
): string => {
  let message = '🙏 PRAYER REQUEST\n\n';
  message += `From: ${name}\n\n`;
  message += `${request}\n\n`;

  if (contact) {
    message += `Contact: ${contact}\n`;
  }

  message += `Urgency: ${urgency === 'urgent' ? 'Urgent' : 'Routine'}\n\n`;
  message += 'Sent via He Reigns Chapel App';

  return message;
};

/**
 * Contact pastor directly via WhatsApp
 */
export const contactPastor = async (message?: string): Promise<boolean> => {
  const defaultMessage = message || 'Hello Pastor, ';
  return openWhatsApp(Contacts.pastorWhatsApp, defaultMessage);
};

/**
 * Send support request
 */
export const sendSupportRequest = async (problem: string): Promise<boolean> => {
  const message = `SUPPORT REQUEST\n\nProblem: ${problem}\n\nSent via He Reigns Chapel App`;
  return openWhatsApp(Contacts.supportWhatsApp, message);
};
