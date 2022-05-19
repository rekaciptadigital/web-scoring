import { idCardFields } from "constants/index";

const { LABEL_PLAYER_NAME, LABEL_LOCATION_AND_DATE, LABEL_CATEGORY, LABEL_CLUB_MEMBER, LABEL_STATUS_EVENT } = idCardFields;


function renderTemplateString(editorData) {
  const documentTitle = editorData.title || "My Archery Certificate";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>${documentTitle}</title>
    <style>
      @page {
        margin: 0px;
      }

      body {
        ${renderCssBackgroundImage(editorData)}
        background-image-resize: 6; /* properti custom mpdf, mirip background-size: cover */
        position: relative;
        margin: 0px;
        padding: 0px;
        font-family: "DejaVu Sans", sans-serif;
      }

      .field-text {
        position: absolute;
        left: 0px;
        right: 0px;
        text-align: center;
      }

      .qr-code-container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 120px;
      }

      .qr-code-centering {
        margin: 0 auto;
        width: 25mm;
        height: 25mm;
        padding: 2mm;
        background-color: white;
      }

      .qr-code-img {
        margin: 0;
      }

      ${renderCssField(LABEL_PLAYER_NAME, editorData.fields[0])}
      ${renderCssField(LABEL_LOCATION_AND_DATE, editorData.fields[1])}
      ${renderCssField(LABEL_CATEGORY, editorData.fields[2])}
      ${renderCssField(LABEL_CLUB_MEMBER, editorData.fields[2])}
      ${renderCssField(LABEL_STATUS_EVENT, editorData.fields[2])}
    </style>
  </head>

  <body>
    ${renderFieldText(LABEL_PLAYER_NAME)}
    ${renderFieldText(LABEL_LOCATION_AND_DATE)}
    ${renderFieldText(LABEL_CATEGORY)}
    ${renderFieldText(LABEL_CLUB_MEMBER)}
    ${renderFieldText(LABEL_STATUS_EVENT)}
    ${renderQrCode()}
  </body>
</html>`;
}

const renderCssBackgroundImage = (editorData) => {
  if (!editorData.backgroundFileRaw && !editorData.backgroundUrl) {
    return "";
  }
  return `
      background-image: url({%background%});
  `;
};

function renderCssField(name, data = {}) {
  const { y, fontFamily, fontWeight, fontSize, color } = data;

  const computeColor = () => (color ? `color: ${color};` : "");
  const computeFontWeight = () => fontWeight || "normal";

  return `
      #field-${name} {
        top: ${y}px;
        ${computeColor()}
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        font-weight: ${computeFontWeight()};
      }`;
}

function renderFieldText(name) {
  const placeholderString = name === LABEL_PLAYER_NAME ? `{%${name}%}` : `{%${name}%}`;
  return `<div class="field-text" id="field-${name}">${placeholderString}</div>`;
}

function renderQrCode() {
  const urlPlaceholder = "{%certificate_verify_url%}";
  return `
    <div class="qr-code-container">
      <div class="qr-code-centering">
        <barcode
          class="qr-code-img"
          code="${urlPlaceholder}"
          type="QR"
          error="M"
          class="barcode"
          size="1"
          disableborder="1" />
      </div>
    </div>`;
}

export { renderTemplateString };
