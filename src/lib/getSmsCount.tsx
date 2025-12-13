// Check if non-GSM characters exist
// Utility to check if text contains Unicode (non-GSM) characters
// Check if non-GSM characters exist
const isUnicode = (text: string) => {
  // eslint-disable-next-line no-control-regex
  const gsmRegex = /^[\x00-\x7F]*$/;
  const extendedChars = /[~^{}[\]|€\\]/;
  return !gsmRegex.test(text) || extendedChars.test(text);
};

// Utility to calculate SMS character count and SMS count
export function getSmsCount(text: string) {
  const unicode = isUnicode(text);
  const charsPerSms = unicode ? 70 : 160;
  const charCount = text.length;
  const smsCount = charCount === 0 ? 0 : Math.ceil(charCount / charsPerSms);
  return { charCount, smsCount };
}
