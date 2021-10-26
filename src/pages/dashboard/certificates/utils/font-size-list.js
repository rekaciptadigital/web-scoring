const createFontSizeOptions = (sizeList) => {
  return sizeList.map((sizeNumber) => ({
    value: sizeNumber,
    label: sizeNumber,
  }));
};

const optionsFontSize = createFontSizeOptions([
  8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 27, 28, 30, 32, 36, 38, 40, 42, 46, 48, 50, 52, 56, 60, 72,
]);

export default optionsFontSize;
