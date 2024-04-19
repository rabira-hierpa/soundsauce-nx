const parseDate = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const _date = new Date(year + 2000, month - 1, day, hour, minute);
  console.log({ _date });
  // JavaScript's Date months are 0-indexed
  return _date;
};
export default parseDate;
