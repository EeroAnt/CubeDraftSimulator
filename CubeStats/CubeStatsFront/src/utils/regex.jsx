export const matchesRegex = (text, pattern) => {
  try {
    return new RegExp(pattern, "i").test(text);
  } catch {
    return false;
  }
};