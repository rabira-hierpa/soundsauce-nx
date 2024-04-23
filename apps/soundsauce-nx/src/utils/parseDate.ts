const parseDate = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const _date = new Date(year + 2000, day, month - 1, hour, minute);
  // JavaScript's Date months are 0-indexed
  return _date;
};
export default parseDate;
