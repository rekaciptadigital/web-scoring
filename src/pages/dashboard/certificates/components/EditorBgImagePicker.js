import * as React from "react";

import { Button } from "reactstrap";

export default function EditorBgImagePicker({
  image = { preview: null, raw: null },
  onSelectImage,
  onRemoveImage,
}) {
  const handleClickUpload = (ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    onSelectImage(ev.target.files[0]);
  };

  if (!image.preview) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-secondary bg-opacity-10">
        <div className="text-center">
          <label htmlFor="button-upload-bg-image">
            <Button tag="span" color="primary">
              <i className="bx bx-image-add font-size-18 align-middle" /> Upload Background
            </Button>
            <input
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              id="button-upload-bg-image"
              onChange={(ev) => handleClickUpload(ev)}
              style={{ display: "none" }}
            />
          </label>
          <p className="mt-3 mb-0">PNG/JPEG, Ukuran 1280 x 908 pixel</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-secondary bg-opacity-10"
      style={{
        backgroundImage: `url(${image.preview})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="d-flex justify-content-center align-items-center bg-white bg-opacity-75 text-center w-100 h-100">
        <label htmlFor="button-upload-bg-image" style={{ margin: 0 }}>
          <Button tag="span" color="primary">
            Ganti Background
          </Button>
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            id="button-upload-bg-image"
            onChange={(ev) => handleClickUpload(ev)}
            style={{ display: "none" }}
          />
        </label>

        <Button color="link" className="link-danger ms-2" onClick={() => onRemoveImage()}>
          <i className="bx bx-trash font-size-18 align-middle" />
        </Button>
      </div>
    </div>
  );
}
