import { idCardFields } from "constants/index";

const {
  LABEL_PLAYER_NAME,
  LABEL_GENDER,
  LABEL_LOCATION_AND_DATE,
  LABEL_CATEGORY,
  LABEL_CLUB_MEMBER,
  LABEL_BUDREST,
  LABEL_STATUS_EVENT,
  LABEL_QR_CODE,
  LABEL_AVATAR,
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
      ${renderCSSFieldText(LABEL_GENDER, editorData.fields[LABEL_GENDER])}
      ${renderCSSFieldText(LABEL_LOCATION_AND_DATE, editorData.fields[LABEL_LOCATION_AND_DATE])}
      ${renderCSSFieldText(LABEL_CATEGORY, editorData.fields[LABEL_CATEGORY])}
      ${renderCSSFieldText(LABEL_CLUB_MEMBER, editorData.fields[LABEL_CLUB_MEMBER])}
      ${renderCSSFieldText(LABEL_BUDREST, editorData.fields[LABEL_BUDREST])}
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
    ${renderHTMLFieldText(LABEL_GENDER, editorData.fields[LABEL_GENDER].isVisible)}
    ${renderHTMLFieldText(
      LABEL_LOCATION_AND_DATE,
      editorData.fields[LABEL_LOCATION_AND_DATE].isVisible
    )}
    ${renderHTMLFieldText(LABEL_CATEGORY, editorData.fields[LABEL_CATEGORY].isVisible)}
    ${renderHTMLFieldText(LABEL_CLUB_MEMBER, editorData.fields[LABEL_CLUB_MEMBER].isVisible)}
    ${renderHTMLFieldText(LABEL_BUDREST, editorData.fields[LABEL_BUDREST].isVisible)}
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
  const placeholderString = _makePlaceholderStringByName(name);
  return `<div class="field-text" id="field-${name}">${placeholderString}</div>`;
}

function renderCssFieldBoxQR(data = {}) {
  const { y, x } = data;
  return `
    #field-box-qr-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;

      width: 28mm;
      height: 28mm;
      padding: 1mm;
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
  const placeholderString = _makePlaceholderStringByName("certificate_verify_url");
  // Docs untuk barcode mpdf:
  // https://mpdf.github.io/reference/html-control-tags/barcode.html
  // Example: https://github.com/mpdf/mpdf-examples/blob/development/example37_barcodes.php#L382=

  // `size=1` itu 25mm. Untuk 30mm, size diskala jadi `size=1.2`
  // Ref: https://github.com/mpdf/mpdf-examples/blob/development/example37_barcodes.php#L368=
  return `
    <div id="field-box-qr-container">
      <barcode
        class="barcode qr-code--img"
        code="${placeholderString}"
        type="QR"
        error="M"
        size="1.15"
        disableborder="1"
        title="QR Code"
        alt="QR Code"
        />
    </div>`;
}

function renderCSSAvatarField(data = {}) {
  const { y, x } = data;
  const placeholderString = _makePlaceholderStringByName("avatar");
  return `
    #field-box-avatar-container {
      position: absolute;
      top: ${y}px;
      left: ${x}px;
      width: 40mm;
      height: 40mm;
      overflow: hidden;

      /* Uncomment aja warna bg kalau perlu */
      /* background-color: white; */
      background-image: url(${placeholderString});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }`;
}

function renderHTMLFieldBoxAvatar(isVisible) {
  if (!isVisible) {
    return "";
  }
  return `<div id="field-box-avatar-container"></div>`;
}

function _makePlaceholderStringByName(name) {
  return `{%${name}%}`;
}

export { renderTemplateString };
