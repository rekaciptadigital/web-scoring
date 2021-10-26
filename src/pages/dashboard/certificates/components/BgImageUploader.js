import * as React from "react";

import { Button } from "reactstrap";

export default function BgImageUploader({ image, onSelectImage, onRemoveImage }) {
  const handleClickUpload = () => {
    onSelectImage();
  };

  if (!image) {
    return (
      <div className="text-center">
        <Button color="primary" onClick={() => handleClickUpload()}>
          <i className="bx bx-image-add font-size-18 align-middle" /> Upload Background
        </Button>
        <p className="mt-3 mb-0">PNG/JPEG, Ukuran 1280 x 908 pixel</p>
      </div>
    );
  }

  return (
    <div className="text-center" style={{ backgroundColor: "gold" }}>
      <Button color="primary" onClick={() => handleClickUpload()}>
        Ganti Background
      </Button>

      <Button color="link" className="link-danger ms-2" onClick={() => onRemoveImage()}>
        <i className="bx bx-trash font-size-18 align-middle" />
      </Button>
    </div>
  );
}
