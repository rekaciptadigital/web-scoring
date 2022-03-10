import { certificateFields, certificateTypes } from "constants/index";

const { LABEL_MEMBER_NAME, LABEL_CATEGORY_NAME, LABEL_RANK } = certificateFields;

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
        ${renderCssBackgroundImage(editorData.backgroundImage, editorData.typeCertificate)}
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

      ${renderCssField(LABEL_MEMBER_NAME, editorData.fields[0])}
      ${renderCssField(LABEL_RANK, editorData.fields[1])}
      ${renderCssField(LABEL_CATEGORY_NAME, editorData.fields[2])}
    </style>
  </head>

  <body>
    ${renderFieldText(LABEL_MEMBER_NAME)}
    ${isTypeWinner(editorData.typeCertificate) ? renderFieldText(LABEL_RANK) : ""}
    ${renderFieldText(LABEL_CATEGORY_NAME)}
    ${renderQrCode()}
  </body>
</html>`;
}

function isTypeWinner(type) {
  return (
    type === certificateTypes.WINNER_ELIMINATION ||
    type === certificateTypes.WINNER_QUALIFICATION ||
    type === certificateTypes.WINNER_TEAM
  );
}

const renderCssBackgroundImage = (backgroundImage, type) => {
  if (backgroundImage) {
    const imgUrl = getImgUrl(backgroundImage, { debug: true, type });
    return `
        background-image: url(${imgUrl});
        background-image-resize: 6; /* properti custom mpdf, mirip background-size: cover */`;
  }
  return "";
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

/**
 *
 * @param {string} backgroundImage URL gambar asli yang diupload user
 * @param {object} debugConfig { debug: true | false, type: 1 | 2 | 3 | 4 | 5 }
 * @returns {string} URL gambar backgound sertifikat
 */
function getImgUrl(backgroundImage, { debug = false, type } = {}) {
  if (!debug) {
    return backgroundImage;
  }
  const imgPeserta = "https://i.postimg.cc/0kMc6vR6/meqzn64ab9h-3-8-2022.png";
  const imgJuara = "https://i.postimg.cc/yBzkZqr0/sertifikat-dki-series-juara.jpg";
  const fixedImages = {
    1: imgPeserta,
    3: imgPeserta,
    2: imgJuara,
    4: imgJuara,
    5: imgJuara,
  };
  return fixedImages[type];
}

export { renderTemplateString };
