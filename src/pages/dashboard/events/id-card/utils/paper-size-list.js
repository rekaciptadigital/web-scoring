export const A4 = "A4";
export const A5 = "A5";
export const A6 = "A6";

export const optionsPaperSize = [
  { value: A4, label: "A4 (21 cm x 29,7 cm)" },
  { value: A5, label: "A5 (14,8 cm x 21,0 cm)" },
  { value: A6, label: "A6 (10,5 cm x 14,8 cm)" },
];

export const getSelectedPaperSize = (optionsPaperSize, fieldData) => {
  return {
    value: fieldData?.paperSize,
    label: optionsPaperSize.find((font) => {
      return font.value === fieldData?.paperSize;
    })?.label,
  };
};
