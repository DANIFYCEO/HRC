// Church contact information for He Reigns Chapel
// Powerline Living Water Ministries

export const Contacts = {
  // WhatsApp numbers
  pastorWhatsApp: '2348051368669',
  supportWhatsApp: '2347042650401',

  // Phone numbers
  churchOffice: '08168007749',

  // Church information
  churchName: 'He Reigns Chapel',
  churchTagline: 'Powerline Living Water Ministries',
  churchAddress: 'No 1 mission road, Ata Udo Usung, Ikot Abasi, Akwa Ibom State',

  // Church location coordinates (for Google Maps)
  // You'll need to verify these coordinates or provide the correct ones
  churchCoordinates: {
    latitude: 4.5806, // Approximate for Ikot Abasi
    longitude: 7.5400,
  },
};

// WhatsApp deep linking helper
export const getWhatsAppLink = (phone: string, message?: string): string => {
  const encodedMessage = message ? `&text=${encodeURIComponent(message)}` : '';
  return `whatsapp://send?phone=${phone}${encodedMessage}`;
};

// Phone dialer helper
export const getPhoneLink = (phone: string): string => {
  return `tel:${phone}`;
};

// Google Maps helper
export const getMapLink = (address: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

// App share message
export const getShareMessage = (): string => {
  return `Check out the ${Contacts.churchName} app! Download it to access Bible study, Sunday School lessons, prayer requests, and more. [App Store / Play Store Link]`;
};
