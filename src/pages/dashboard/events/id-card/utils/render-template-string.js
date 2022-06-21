import { idCardFields } from "constants/index";

const {
  LABEL_PLAYER_NAME,
  LABEL_LOCATION_AND_DATE,
  LABEL_CATEGORY,
  LABEL_CLUB_MEMBER,
  LABEL_STATUS_EVENT,
} = idCardFields;

function renderTemplateString(editorData, config) {
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
        width: ${config.maxTextWidth}px;
        text-align: center;
      }

      .qr-code-centering {
        margin: 0 auto;
        width: 35mm;
        height: 35mm;
      }

      .qr-code-img {
        margin: 0;
        width: 50mm;
        height: 50mm;
      }

      ${renderCssField(LABEL_PLAYER_NAME, editorData.fields[LABEL_PLAYER_NAME])}
      ${renderCssField(LABEL_LOCATION_AND_DATE, editorData.fields[LABEL_LOCATION_AND_DATE])}
      ${renderCssField(LABEL_CATEGORY, editorData.fields[LABEL_CATEGORY])}
      ${renderCssField(LABEL_CLUB_MEMBER, editorData.fields[LABEL_CLUB_MEMBER])}
      ${renderCssField(LABEL_STATUS_EVENT, editorData.fields[LABEL_STATUS_EVENT])}
      ${renderCssQrField(editorData.fields["qrCode"])}
      ${renderCssAvatarField(editorData.fields["photoProfile"])}
    </style>
  </head>

  <body>
    ${renderFieldText(LABEL_PLAYER_NAME, editorData.fields[LABEL_PLAYER_NAME].isVisible)}
    ${renderFieldText(
      LABEL_LOCATION_AND_DATE,
      editorData.fields[LABEL_LOCATION_AND_DATE].isVisible
    )}
    ${renderFieldText(LABEL_CATEGORY, editorData.fields[LABEL_CATEGORY].isVisible)}
    ${renderFieldText(LABEL_CLUB_MEMBER, editorData.fields[LABEL_CLUB_MEMBER].isVisible)}
    ${renderFieldText(LABEL_STATUS_EVENT, editorData.fields[LABEL_STATUS_EVENT].isVisible)}
    ${renderQrCode(editorData.fields["qrCode"].isVisible)}
    ${renderAvatar(editorData.fields["photoProfile"].isVisible)}
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
  const { y, fontFamily, fontWeight, fontSize, color, x } = data;

  const computeColor = () => (color ? `color: ${color};` : "");
  const computeFontWeight = () => fontWeight || "normal";

  return `
      #field-${name} {
        top: ${y}px;
        left: ${x}px;
        ${computeColor()}
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        font-weight: ${computeFontWeight()};
      }`;
}

function renderFieldText(name, isVisible) {
  if (!isVisible) {
    return "";
  }
  const placeholderString = name === LABEL_PLAYER_NAME ? `{%${name}%}` : `{%${name}%}`;
  return `<div class="field-text" id="field-${name}">${placeholderString}</div>`;
}

function renderCssQrField(data = {}) {
  const { y, x } = data;
  return `
    #qr-code-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;
      padding-left: 300px;
    }`;
}

function renderCssAvatarField(data = {}) {
  const { y, x } = data;
  return `
    #qr-avatar-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;
      padding-left: 250px;
    }`;
}

function renderQrCode(isVisible) {
  if (!isVisible) {
    return "";
  }
  const urlPlaceholder = "{%certificate_verify_url%}";
  return `
    <div id="qr-code-container">
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

function renderAvatar(isVisible) {
  if (!isVisible) {
    return "";
  }
  const urlPlaceholder = "{%avatar%}";
  return `
    <div id="qr-avatar-container">
      <div class="qr-code-centering">
        <img
          class="qr-code-img"
          src="${urlPlaceholder}"
          class="barcode" />
      </div>
    </div>`;
}

export { renderTemplateString };
