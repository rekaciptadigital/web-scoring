import optionsFontSize from "../../../certificates/utils/font-size-list";
import { optionsFontFamily, getSelectedFontFamily } from "../../../certificates/utils/font-family-list";
import { optionsTypeCertificate, getCurrentTypeCertificate } from "../../../certificates/utils/";
import { optionsPaperSize, getSelectedPaperSize } from "./paper-size-list";
import { optionsOrientation, getSelectedOrientation } from "./orientation-list"; 
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
  optionsPaperSize,
  getSelectedPaperSize,
  optionsOrientation,
  getSelectedOrientation,
  renderTemplateString,
  convertBase64,
};
