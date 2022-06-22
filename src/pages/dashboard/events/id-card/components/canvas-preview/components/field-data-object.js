import * as React from "react";
import styled from "styled-components";

import { TextData } from "./object-data-text";

import IconUser from "components/ma/icons/mono/user";
import IconQR from "components/ma/icons/mono/qr";

function FieldDataObject({ field, exampleValue }) {
  if (!field) {
    return null;
  }

  if (field.type === "text") {
    return (
      <TextData
        title={field.label}
        text={exampleValue || field.label}
        fontFamily={field.fontFamily}
        fontSize={field.fontSize}
        color={field.color}
        isBold={field.isBold}
      />
    );
  }

  if (field.type === "box-qr") {
    return (
      <BoxQRWrapper title={field.label}>
        <div>
          <IconQR size="174px" />
        </div>
      </BoxQRWrapper>
    );
  }

  if (field.type === "box-avatar") {
    return (
      <BoxAvatarWrapper title={field.label}>
        {exampleValue ? (
          <div className="avatar">
            <img src={exampleValue} alt="Foto Profil" />
          </div>
        ) : (
          <div>
            <div>
              <IconUser size="2cm" />
            </div>
            <h5>{field.label}</h5>
          </div>
        )}
      </BoxAvatarWrapper>
    );
  }

  // Kalau gak terduga ada type yang gak dikenal, fallback gak render apa-apa
  return null;
}

const BoxQRWrapper = styled.div`
  width: 130px;
  height: 130px;
  overflow: hidden;

  > * {
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .avatar > img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const BoxAvatarWrapper = styled.div`
  width: 174px;
  height: 174px;
  overflow: hidden;

  > * {
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .avatar > img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

export { FieldDataObject };
