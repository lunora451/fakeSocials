const optionsHourPrecisions = {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris", // GMT+1 time zone
};

const toFormattedDateWithHours = (dateString) => {
  const date = new Date(dateString);
  const formattedDateTime = date.toLocaleString("en-En", optionsHourPrecisions);
  return formattedDateTime; // Output: "27 juin, 11:00"
};

const optionsDayPrecisions = {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris", // GMT+1 time zone
};

const toFormattedDateWithDay = (dateString) => {
  const date = new Date(dateString);
  const formattedDateTime = date.toLocaleString("en-En", optionsDayPrecisions);
  return formattedDateTime; // Output: "27 juin, 11:00"
};

export { toFormattedDateWithHours, toFormattedDateWithDay };
