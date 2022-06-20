import * as React from "react";
import styled from "styled-components";

import Draggable from "react-draggable";

import classnames from "classnames";

function MoveableObject({ children, scale, isSelected, onSelect, x, y, onMove }) {
  return (
    <Draggable
      scale={scale}
      position={{ x, y }}
      onStart={onSelect}
      onStop={(ev, translation) => onMove?.({ x: translation.x, y: translation.y })}
    >
      <MoveableContainerDiv
        className={classnames({ "object-active": isSelected })}
        style={{
          "--outline-svg-idle": _makeOutlineSvg(SVG_OUTLINE.idle, scale),
          "--outline-svg-hover": _makeOutlineSvg(SVG_OUTLINE.hover, scale),
          "--outline-svg-active": _makeOutlineSvg(SVG_OUTLINE.active, scale),
        }}
      >
        {children}
      </MoveableContainerDiv>
    </Draggable>
  );
}

const MoveableContainerDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  user-select: none;
  background-image: var(--outline-svg-idle);

  &,
  & * {
    text-align: center;
  }

  &:hover {
    cursor: grab;
    background-image: var(--outline-svg-hover);
  }

  &.object-active {
    background-image: var(--outline-svg-active);

    &:active {
      cursor: grabbing;
    }
  }
`;

const SVG_OUTLINE = {
  idle: { color: "turquoise", isDashed: true },
  hover: { color: "rgb(79, 128, 255)" },
  active: { color: "rgb(79, 128, 255)", isThick: true },
};

function _makeOutlineSvg(
  { color = "currentColor", isThick = false, isDashed = false } = {},
  scale = 1
) {
  const withScale = (number) => number / scale;
  const strokeWidth = withScale(isThick ? 4 : 2);
  const strokeDash = isDashed ? " stroke-dasharray='6%2c 14' stroke-dashoffset='0' " : " ";

  return `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='${color}' stroke-width='${strokeWidth}'${strokeDash}stroke-linecap='square'/%3e%3c/svg%3e")`;
}

export { MoveableObject };
