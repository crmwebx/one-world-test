export function isObjectEmpty(inputObject) {
  if (inputObject !== undefined) {
    return Object.keys(inputObject).length === 0;
  }
  return true;
}

export function dateFormatter(data) {
  var date = new Date(data);
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "/" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
    "/" +
    date.getFullYear()
  );
}
