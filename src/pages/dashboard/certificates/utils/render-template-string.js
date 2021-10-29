import bg from "./mock-image-base64";

function renderTemplateString(editorData) {
  const documentTitle = editorData.title || "My Archery Certificate";
  const width = 1280;

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
        background-color: azure;
      }

      .paper {
        position: relative;
        overflow: hidden;
        max-width: ${width}px;
        margin: 0px auto;
      }

      .design {
        max-width: ${width || 0}px;
      }

      .field-text {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="paper">
      <img class="design" src="${editorData.backgroundImage || bg}" />
      ${renderFieldText({
        name: "member_name",
        data: editorData.fields["member_name"],
      })}
      ${renderFieldText({
        name: "peringkat_name",
        data: editorData.fields["peringkat_name"],
      })}
      ${renderFieldText({
        name: "kategori_name",
        data: editorData.fields["kategori_name"],
      })}
    </div>
  </body>
</html>
`;
}

function renderFieldText({ name, data = {} }) {
  const { y, fontFamily, fontSize, color } = data;
  const placeholderString = `{%${name}%}`;

  return `<div class="field-text" id="field-${name}"
  style="font-size: ${fontSize}px;${
    color ? ` color: ${color};` : ""
  } font-family: ${fontFamily}; top: ${y}px;"
>
  ${placeholderString}
</div>`;
}

export { renderTemplateString };
