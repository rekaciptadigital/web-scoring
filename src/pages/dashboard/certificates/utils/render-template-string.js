import { certificateFields, certificateTypes } from "constants/index";

const { LABEL_MEMBER_NAME, LABEL_CATEGORY_NAME, LABEL_RANK } = certificateFields;
// landscape
const A4_WIDTH = 1287;
const fieldMaxWidth = Math.ceil(0.7 * A4_WIDTH);

function renderTemplateString(editorData) {
  const documentTitle = editorData.title || "My Archery Certificate";
  const isWinnerType = checkTypeIsWinner(editorData.typeCertificate);

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
        // width: ${fieldMaxWidth}px;
        // text-align: right;
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

      ${renderCssField(LABEL_MEMBER_NAME, editorData.fields[0])}
      ${renderCssField(LABEL_RANK, editorData.fields[1])}
      ${renderCssField(LABEL_CATEGORY_NAME, editorData.fields[2])}
    </style>
  </head>

  <body>
    ${renderFieldText(LABEL_MEMBER_NAME)}
    ${isWinnerType ? renderFieldText(LABEL_RANK) : ""}
    ${renderFieldText(LABEL_CATEGORY_NAME)}
    ${renderQrCode()}
  </body>
</html>`;
}

function checkTypeIsWinner(type) {
  return (
    type === certificateTypes.WINNER_ELIMINATION ||
    type === certificateTypes.WINNER_QUALIFICATION ||
    type === certificateTypes.WINNER_TEAM ||
    type === certificateTypes.WINNER_TEAM_MIXED
  );
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
  // const editorObject = { x, offsetWidth };
  // const templateObject = { offsetWidth: fieldMaxWidth };
  // const rightAlignedX = _getRightAlignedX(editorObject, templateObject);

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
  const placeholderString = name === LABEL_RANK ? `Juara {%${name}%}` : `{%${name}%}`;
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

// function _getRightAlignedX(editorObject, templateObject) {
//   const delta = templateObject.offsetWidth - editorObject.offsetWidth;
//   return editorObject.x - delta;
// }

export { renderTemplateString };
