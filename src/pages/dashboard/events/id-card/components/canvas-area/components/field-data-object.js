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
      <BoxImageWrapper title={title}>
        <div>
          <IconQR size="calc(3cm - 10px)" />
        </div>
      </BoxImageWrapper>
    );
  }

  if (field.type === "box-avatar") {
    const title = field.label + ` (variabel: ${field.name})`;
    return (
      <BoxImageWrapper title={title} style={{ width: "3cm", height: "3cm", padding: "5px" }}>
        <div>
          <div>
            <IconUser size="2cm" />
          </div>
          <h5>{field.label}</h5>
        </div>
      </BoxImageWrapper>
    );
  }

  // Kalau gak terduga ada type yang gak dikenal, fallback gak render apa-apa
  return null;
}

const BoxImageWrapper = styled.div`
  width: 3cm;
  height: 3cm;
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
