// Couple names used across the invitation and the admin message generator
export const GROOM_NAME = 'Pubudu';
export const BRIDE_NAME = 'Kavindya';

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;

// "Dear" is a greeting style, not a title — it never becomes part of the display name,
// so "Dear {displayName}" can never turn into "Dear Dear Sanjaya".
export const buildDisplayName = (prefix: string, guestName: string) => {
  const name = guestName.trim().replace(/\s+/g, ' ');
  if (!name) return '';
  if (prefix === 'Family') return `${name} and Family`;
  if (prefix === 'Dear' || !prefix) return name;
  return `${prefix} ${name}`;
};

// Link structure: {baseURL}/{guestName}?p={prefix}
export const buildGuestLink = (baseUrl: string, prefix: string, guestName: string) => {
  const name = guestName.trim().replace(/\s+/g, ' ');
  const query = prefix && prefix !== 'Dear' ? `?p=${encodeURIComponent(prefix)}` : '';
  return `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(name)}${query}`;
};

export const buildInvitationMessage = (displayName: string, link: string) =>
  `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

// Reads the guest from /{guestName}?p={prefix} (or the older ?prefix=&name= links)
export const getGuestDisplayName = () => {
  const params = new URLSearchParams(window.location.search);
  const pathName = safeDecode(window.location.pathname.replace(/^\/+|\/+$/g, ''));
  const guestName = params.get('name') || pathName;
  const prefix = params.get('p') || params.get('prefix') || '';
  return guestName ? buildDisplayName(prefix, guestName) : '';
};
