import * as React from "react";
import styled from "styled-components";
import { Button } from "reactstrap";
import { ButtonBlue } from "components/ma";

import classnames from "classnames";

export default function PosterImagePicker({ image, onChange, onRemove, errors, disabled }) {
  const computeStyleBackgroundImage = () => {
    return !image?.preview && !image?.originalUrl
      ? {}
      : { "--picker-poster-image-url": `url("${image.preview || image.originalUrl}")` };
  };

  return (
    <PickerWrapper
      className={classnames({ "error-invalid": errors?.length })}
      style={{ ...computeStyleBackgroundImage() }}
    >
      <div className="image-overlay"></div>
      <div className="picker-body">
        <div className="mb-2">
          {!disabled && (
            <label htmlFor="image-picker-field">
              <ButtonBlue as="span">{image ? "Ganti Banner" : "Pilih Banner"}</ButtonBlue>
              <input
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                id="image-picker-field"
                onChange={(ev) => onChange?.(ev)}
              />
            </label>
          )}

          {!disabled && image && (
            <Button
              color="link"
              className="text-white banner-button-remove"
              onClick={() => onRemove?.()}
            >
              <i className="bx bx-trash font-size-18 align-middle" />
            </Button>
          )}
        </div>
        <p>PNG&#47;JPEG, Ukuran 1280 x 908 pixel</p>
      </div>
    </PickerWrapper>
  );
}

const PickerWrapper = styled.div`
  --picker-default-bg-color: #545454;

  position: relative;
  width: 100%;
  padding-top: 42%;

  overflow: hidden;
  background-color: var(--picker-default-bg-color);
  background-image: var(--picker-poster-image-url);
  background-position: center;
  background-size: cover;
  text-align: center;

  &.error-invalid {
    box-shadow: 0 0 0 2px var(--ma-red);
  }

  .image-overlay {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--picker-default-bg-color);
    opacity: 0.5;
  }

  .picker-body {
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;

    color: #ffffff;
    transition: all 0.4s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }

    #image-picker-field {
      position: absolute;
      top: -200%;
      left: -200%;
      visibility: hidden;
    }
  }
`;
