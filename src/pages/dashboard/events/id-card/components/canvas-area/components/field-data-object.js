import * as React from "react";
import styled from "styled-components";

import { TextData } from "./object-data-text";

import IconUser from "components/ma/icons/mono/user";
import IconQR from "components/ma/icons/mono/qr";

function FieldDataObject({ field }) {
  if (!field) {
    return null;
  }

  if (field.type === "text") {
    return (
      <TextData
        title={field.name}
        text={field.label || field.name}
        fontFamily={field.fontFamily}
        fontSize={field.fontSize}
        color={field.color}
        isBold={field.isBold}
      />
    );
  }

  if (field.type === "box-qr") {
    const title = field.label + ` (variabel: ${field.name})`;
    return (
      <BoxQRWrapper title={title}>
        <div>
          <IconQR size="calc(174px - 10px)" />
        </div>
      </BoxQRWrapper>
    );
  }

  if (field.type === "box-avatar") {
    const title = field.label + ` (variabel: ${field.name})`;
    return (
      <BoxAvatarWrapper title={title}>
        <div>
          <div>
            <IconUser size="2cm" />
          </div>
          <h5>{field.label}</h5>
        </div>
      </BoxAvatarWrapper>
    );
  }

  // Kalau gak terduga ada type yang gak dikenal, fallback gak render apa-apa
  return null;
}

const BoxQRWrapper = styled.div`
  width: 130px;
  height: 130px;
  padding: 5px;

  > * {
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const BoxAvatarWrapper = styled.div`
  width: 174px;
  height: 174px;
  padding: 5px;

  > * {
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export { FieldDataObject };
