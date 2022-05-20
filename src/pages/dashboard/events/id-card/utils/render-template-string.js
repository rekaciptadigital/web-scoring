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

      ${renderCssField(LABEL_PLAYER_NAME, editorData.fields[0])}
      ${renderCssField(LABEL_LOCATION_AND_DATE, editorData.fields[1])}
      ${renderCssField(LABEL_CATEGORY, editorData.fields[2])}
      ${renderCssField(LABEL_CLUB_MEMBER, editorData.fields[3])}
      ${renderCssField(LABEL_STATUS_EVENT, editorData.fields[4])}
      ${renderCssQrField(LABEL_STATUS_EVENT, editorData.qrFields)} 
      ${renderCssAvatarField(LABEL_STATUS_EVENT, editorData.photoProfileField)}      
    </style>
  </head>

  <body>
    ${renderFieldText(LABEL_PLAYER_NAME)}
    ${renderFieldText(LABEL_LOCATION_AND_DATE)}
    ${renderFieldText(LABEL_CATEGORY)}
    ${renderFieldText(LABEL_CLUB_MEMBER)}
    ${renderFieldText(LABEL_STATUS_EVENT)}
    ${renderQrCode()}
    ${renderAvatar()}
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

function renderFieldText(name) {
  const placeholderString = name === LABEL_PLAYER_NAME ? `{%${name}%}` : `{%${name}%}`;
  return `<div class="field-text" id="field-${name}">${placeholderString}</div>`;
}

function renderCssQrField(name, data = {}) {
  console.log(data, 'data');  
  const { y, x } = data;

  return `
    #qr-code-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;   
      padding-left: 300px;  
    }`
}

function renderCssAvatarField(name, data = {}) {
  const { y, x } = data;

  return `
    #qr-avatar-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;   
      padding-left: 300px;  
    }`
}

function renderQrCode() {
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

function renderAvatar() {
  const urlPlaceholder = "{%avatar%}";
  return `
    <div class="qr-avatar-container">
      <div class="qr-code-centering">
        <image
          class="qr-code-img"
          src="${urlPlaceholder}"
          class="barcode" />
      </div>
    </div>`;
}

export { renderTemplateString };
