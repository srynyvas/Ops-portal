// Small, dependency-free string helpers (CommonJS) — easy to test with Jest,
// no babel/ts-jest/ESM config required.

/** Reverse a string. */
function reverse(text) {
  return text.split('').reverse().join('');
}

/** True if text reads the same forwards and backwards (ignores case & non-alphanumerics). */
function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

/** Count the vowels (a, e, i, o, u) in text, case-insensitive. */
function countVowels(text) {
  const matches = text.toLowerCase().match(/[aeiou]/g);
  return matches ? matches.length : 0;
}

/** Capitalize the first letter of each space-separated word. */
function capitalizeWords(text) {
  return text
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Truncate text to maxLength, appending '...' if it was shortened.
 *  Throws if maxLength is negative. */
function truncate(text, maxLength) {
  if (maxLength < 0) {
    throw new Error('maxLength must be non-negative');
  }
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
}

module.exports = { reverse, isPalindrome, countVowels, capitalizeWords, truncate };
