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
export const format_date = (dateStr: string): string => {
  // Check if the date is in the format DD.MM.YY
  const parts = dateStr.split('.');
  let date: Date;

  if (parts.length === 3) {
    // If it's in DD.MM.YY format, parse it manually
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
    let year = parseInt(parts[2], 10);

    // Adjust for two-digit years
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }

    date = new Date(year, month, day);
  } else {
    // If it's not in DD.MM.YY format, use the original parsing
    date = new Date(dateStr);
  }

  // Define the month names in German
  const monthNames = [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
  ];

  // Extract the day, month, and year from the Date object
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Format the date as "DD MMM YYYY"
  return `${day.toString().padStart(2, '0')} ${month} ${year}`;
};

export const format_date_time = (dateStr: string): string => {
  // Check if the date is in the format DD.MM.YY
  const parts = dateStr.split('.');
  let date: Date;

  if (parts.length === 3) {
    // If it's in DD.MM.YY format, parse it manually
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
    let year = parseInt(parts[2], 10);

    // Adjust for two-digit years
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }

    date = new Date(year, month, day);
  } else {
    // If it's not in DD.MM.YY format, use the original parsing
    date = new Date(dateStr);
  }

  // Define the month names in German
  const monthNames = [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
  ];

  // Extract the day, month, year, hours, and minutes from the Date object
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the date and time as "DD MMM YYYY, HH:MM"
  return `${day.toString().padStart(2, '0')} ${month} ${year}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};