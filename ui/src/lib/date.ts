export const formatToNaiveDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return '';

  // Create a Date object from the input value
  const date = new Date(dateTimeString);

  // Format the date to ISO string
  let isoString = date.toISOString();

  // Remove the 'Z' at the end (which denotes UTC)
  isoString = isoString.slice(0, -1);

  // If there are fewer than 3 decimal places for milliseconds, pad with zeros
  const parts = isoString.split('.');
  if (parts.length > 1) {
    const milliseconds = parts[1].padEnd(3, '0');
    isoString = `${parts[0]}.${milliseconds}`;
  }

  return isoString;
};
