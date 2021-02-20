const isEmpty = (inputObject) => {
  return Object.keys(inputObject).length === 0;
};

const setEmptyValue = (property) => {
  return property === null ? "" : property;
};

module.exports = {
  isEmpty,
  setEmptyValue,
};
