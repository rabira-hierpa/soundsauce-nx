const parseDate = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  console.log({ month: month - 1, day, year: year + 2000, hour, minute });
  const _date = new Date(year + 2000, month - 1, day, hour, minute);
  // JavaScript's Date months are 0-indexed
  return _date;
};
export default parseDate;
