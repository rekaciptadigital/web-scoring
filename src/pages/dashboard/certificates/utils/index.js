import optionsFontSize from "./font-size-list";
import { optionsFontFamily, getSelectedFontFamily } from "./font-family-list";
import { optionsTypeCertificate, getCurrentTypeCertificate } from "./type-certificate-list";
import { renderTemplateString } from "./render-template-string";

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
  optionsTypeCertificate,
  getCurrentTypeCertificate,
  renderTemplateString,
  convertBase64,
};
