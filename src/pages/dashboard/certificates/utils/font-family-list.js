export const ARIAL = "Arial, sans-serif";
export const DEJAVU_SANS = "'DejaVu Sans', sans-serif";
export const POPPINS = "'Poppins', sans-serif";

export const optionsFontFamily = [
  { value: ARIAL, label: "Arial" },
  { value: DEJAVU_SANS, label: "DejaVu Sans" },
  { value: POPPINS, label: "Poppins" },
];

export const getSelectedFontFamily = (optionsFontFamily, fieldData) => {
  return {
    value: fieldData?.fontFamily,
    label: optionsFontFamily.find((font) => {
      return font.value === fieldData?.fontFamily;
    })?.label,
  };
};
