import { renderTemplateString, convertBase64 } from "../utils";

async function prepareSaveData(editorData, qs) {
  const dataCopy = { ...editorData };

  let imageBase64ForUpload = undefined;
  if (dataCopy.backgroundFileRaw) {
    imageBase64ForUpload = await convertBase64(dataCopy.backgroundFileRaw);
  }

  const certificateHtmlTemplate = renderTemplateString(dataCopy);
  const templateInBase64 = btoa(certificateHtmlTemplate);

  const payload = {
    event_id: parseInt(qs.event_id),
    type_certificate: dataCopy.typeCertificate,
    html_template: templateInBase64,
    background_img: imageBase64ForUpload,
    editor_data: JSON.stringify({
      ...dataCopy,
      backgroundFileRaw: undefined,
      backgroundPreviewUrl: undefined,
    }),
  };

  return payload;
}

export { prepareSaveData };
