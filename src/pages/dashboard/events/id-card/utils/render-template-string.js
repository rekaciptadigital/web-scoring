import { idCardFields } from "constants/index";

const {
  LABEL_PLAYER_NAME,
  LABEL_LOCATION_AND_DATE,
  LABEL_CATEGORY,
  LABEL_CLUB_MEMBER,
  LABEL_STATUS_EVENT,
} = idCardFields;

// TODO: pindah ke file constants?
const LABEL_QR_CODE = "qrCode";
const LABEL_AVATAR = "photoProfile";

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
        background-image: url({%background%});
        background-image-resize: 6; /* properti custom mpdf, mirip background-size: cover */
        position: relative;
        margin: 0px;
        padding: 0px;
        font-family: "DejaVu Sans", sans-serif;
      }

      /* Properti default semua field teks */
      .field-text {
        position: absolute;
        top: 0px;
        left: 0px;
        width: ${config.maxTextWidth}px;
        text-align: center;
      }

      /* Properti spesifik masing-masing field yang dinamis menurut data "desain" di editor */
      ${renderCSSFieldText(LABEL_PLAYER_NAME, editorData.fields[LABEL_PLAYER_NAME])}
      ${renderCSSFieldText(LABEL_LOCATION_AND_DATE, editorData.fields[LABEL_LOCATION_AND_DATE])}
      ${renderCSSFieldText(LABEL_CATEGORY, editorData.fields[LABEL_CATEGORY])}
      ${renderCSSFieldText(LABEL_CLUB_MEMBER, editorData.fields[LABEL_CLUB_MEMBER])}
      ${renderCSSFieldText(LABEL_STATUS_EVENT, editorData.fields[LABEL_STATUS_EVENT])}
      ${renderCssFieldBoxQR(editorData.fields[LABEL_QR_CODE])}
      ${renderCSSAvatarField(editorData.fields[LABEL_AVATAR])}
    </style>
  </head>

  <body>
    <!--
      Sesuai spek mpdf, semua konten yang pakai positioning harus
      di children langsung dari <body>
     -->
    ${renderHTMLFieldText(LABEL_PLAYER_NAME, editorData.fields[LABEL_PLAYER_NAME].isVisible)}
    ${renderHTMLFieldText(
      LABEL_LOCATION_AND_DATE,
      editorData.fields[LABEL_LOCATION_AND_DATE].isVisible
    )}
    ${renderHTMLFieldText(LABEL_CATEGORY, editorData.fields[LABEL_CATEGORY].isVisible)}
    ${renderHTMLFieldText(LABEL_CLUB_MEMBER, editorData.fields[LABEL_CLUB_MEMBER].isVisible)}
    ${renderHTMLFieldText(LABEL_STATUS_EVENT, editorData.fields[LABEL_STATUS_EVENT].isVisible)}
    ${renderHTMLFieldBoxQR(editorData.fields[LABEL_QR_CODE].isVisible)}
    ${renderHTMLFieldBoxAvatar(editorData.fields[LABEL_AVATAR].isVisible)}
  </body>
</html>`;
}

function renderCSSFieldText(name, data = {}) {
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

function renderHTMLFieldText(name, isVisible) {
  if (!isVisible) {
    return "";
  }
  const placeholderString = name === LABEL_PLAYER_NAME ? `{%${name}%}` : `{%${name}%}`;
  return `<div class="field-text" id="field-${name}">${placeholderString}</div>`;
}

function renderCssFieldBoxQR(data = {}) {
  const { y, x } = data;
  return `
    #field-box-qr-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;
    }

    #qr-code--render-container {
      width: 30mm;
      height: 30mm;
      padding: 2mm;
      background-color: white;
    }

    .qr-code--img {
      margin: 0;
    }`;
}

function renderHTMLFieldBoxQR(isVisible) {
  if (!isVisible) {
    return "";
  }
  // Docs untuk barcode mpdf:
  // https://mpdf.github.io/reference/html-control-tags/barcode.html
  // Example: https://github.com/mpdf/mpdf-examples/blob/development/example37_barcodes.php#L382=

  // `size=1` itu 25mm. Untuk 30mm, size diskala jadi `size=1.2`
  // Ref: https://github.com/mpdf/mpdf-examples/blob/development/example37_barcodes.php#L368=
  const urlPlaceholder = "{%certificate_verify_url%}";
  return `
    <div id="field-box-qr-container">
      <div class="qr-code--render-container">
        <barcode
          class="barcode qr-code--img"
          code="${urlPlaceholder}"
          type="QR"
          error="M"
          size="1.2"
          disableborder="1"
          title="QR Code"
          alt="QR Code"
          />
      </div>
    </div>`;
}

function renderCSSAvatarField(data = {}) {
  const { y, x } = data;
  return `
    #field-box-avatar-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;
    }

    #avatar--render-container {
      width: 30mm;
      height: 30mm;
      background-color: white;
    }

    .avatar--img {
      margin: 0;
    }`;
}

function renderHTMLFieldBoxAvatar(isVisible) {
  if (!isVisible) {
    return "";
  }
  const urlPlaceholder = "{%avatar%}";
  return `
    <div id="field-box-avatar-container">
      <div class="avatar--render-container">
        <img
          class="avatar--img"
          width="30mm"
          height="30mm"
          src="${urlPlaceholder}"
          title="Foto Profil User"
          alt="Foto Profil User"
          />
      </div>
    </div>`;
}

export { renderTemplateString };
