import optionsFontSize from "./font-size-list";
import optionsFontFamily from "./font-family-list";

const getSelectedFontFamily = (optionsFontFamily, fieldData) => {
  return {
    value: fieldData?.fontFamily,
    label: optionsFontFamily.find((font) => {
      return font.value === fieldData?.fontFamily;
    })?.label,
  };
};

export { getSelectedFontFamily, optionsFontSize, optionsFontFamily };
