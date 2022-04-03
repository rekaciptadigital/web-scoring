async function fileToBase64(fileRaw) {
  if (!fileRaw) {
    return;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileRaw);
    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
}

export default { fileToBase64 };
