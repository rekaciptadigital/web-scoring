function renderTemplateString(editorData) {
  const documentTitle = editorData.title || "My Archery Certificate";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>${documentTitle}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

      @page {
        margin: 0px;
      }
  
      body {
        margin: 0px;
        padding: 0px;
        background-color: greenyellow; /* buat debugging */
        font-family: DejaVu Sans, sans-serif; /* pre-installed DomPDF, untuk fallback */
      }

      .paper {
        position: relative;
        width: 100%;
      }

      .bg-design {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      .field-text {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        line-height: none; /* hack supaya box gak kepanjangan & sesuai koordinatnya */
      }
    </style>
  </head>

  <body>
    <div class="paper">
      <div class="bg-design" style="background-image: url(${editorData.backgroundImage});"></div>
      
      ${renderFieldText({
        name: "member_name",
        data: editorData.fields[0],
      })}
      ${renderFieldText({
        name: "peringkat_name",
        data: editorData.fields[1],
      })}
      ${renderFieldText({
        name: "kategori_name",
        data: editorData.fields[2],
      })}
    </div>
  </body>
</html>
`;
}

function renderFieldText({ name, data = {} }) {
  const { y, fontFamily, fontSize, color } = data;
  const placeholderString = `{%${name}%}`;

  return `<div class="field-text" id="field-${name}" style="font-size: ${fontSize}px;${
    color ? ` color: ${color};` : ""
  } font-family: ${fontFamily}; top: ${y}px;">
  ${placeholderString}
</div>`;
}

export { renderTemplateString };
