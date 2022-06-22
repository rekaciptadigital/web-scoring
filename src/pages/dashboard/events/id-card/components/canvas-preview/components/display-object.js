import * as React from "react";
import styled from "styled-components";

import { FieldDataObject } from "./field-data-object";

function DisplayObject({ field, exampleValue }) {
  const { x, y } = field;
  return (
    <MoveableContainerDiv style={{ "--object-translate-coords": `${x}px, ${y}px` }}>
      <FieldDataObject field={field} exampleValue={exampleValue} />
    </MoveableContainerDiv>
  );
}

const MoveableContainerDiv = styled.div`
  &,
  & * {
    text-align: center;
  }

  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(var(--object-translate-coords, 100px, 100px));
`;

export { DisplayObject };
