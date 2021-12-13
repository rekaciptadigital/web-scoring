import * as React from "react";
import styled from "styled-components";
import { Button } from "reactstrap";
import { ButtonBlue } from "components/ma";

const PickerWrapper = styled.div`
  --picker-default-bg-color: #545454;

  position: relative;
  background-color: var(--picker-default-bg-color);
  background-image: var(--picker-poster-image-url);
  text-align: center;

  .image-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--picker-default-bg-color);
    opacity: 0.5;
  }

  .picker-body {
    overflow: hidden;
    position: relative;
    height: 400px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;

    color: #ffffff;

    #image-picker-field {
      position: absolute;
      top: -200%;
      left: -200%;
      visibility: hidden;
    }
  }
`;

export default function PosterImagePicker({ image, onChange }) {
  const computeImageAsBackground = () => {
    if (image) {
      return { "--picker-poster-image-url": `url(${computeImageAsBackground()})` };
    }
    return {};
  };

  return (
    <PickerWrapper style={{ ...computeImageAsBackground() }}>
      <div className="image-overlay"></div>
      <div className="picker-body">
        <div className="mb-2">
          <label htmlFor="image-picker-field">
            <ButtonBlue as="span">Ganti Banner</ButtonBlue>
            <input type="file" id="image-picker-field" onChange={(ev) => onChange?.(ev)} />
          </label>

          <Button color="link" className="text-white">
            <i className="bx bx-trash font-size-18 align-middle" />
          </Button>
        </div>
        <p>PNG&#47;JPEG, Ukuran 1280 x 908 pixel</p>
      </div>
    </PickerWrapper>
  );
}
