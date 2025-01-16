export const calculateTimeSaved = (
  normalText: string,
  shorthandText: string
): number => {
  // Calculate time saved based on the difference in length between normal and shorthand text
  const normalWords = normalText.trim().split(/\s+/).length;
  const shorthandWords = shorthandText.trim().split(/\s+/).length;

  // Assuming average typing speed of 40 WPM for normal text
  const normalTimeMinutes = normalWords / 40;
  const shorthandTimeMinutes = shorthandWords / 40;

  // Convert to milliseconds and return the difference
  return Math.round((normalTimeMinutes - shorthandTimeMinutes) * 60000);
};
