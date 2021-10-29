import optionsFontSize from "./font-size-list";
import optionsFontFamily from "./font-family-list";
import { renderTemplateString } from "./render-template-string";

const getSelectedFontFamily = (optionsFontFamily, fieldData) => {
  return {
    value: fieldData?.fontFamily,
    label: optionsFontFamily.find((font) => {
      return font.value === fieldData?.fontFamily;
    })?.label,
  };
};

async function convertBase64(imageFileRaw) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFileRaw);
    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
}

export {
  getSelectedFontFamily,
  optionsFontSize,
  optionsFontFamily,
  renderTemplateString,
  convertBase64,
};
