import React from "react";

function IconDot({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="8" fill="currentColor" />
    </svg>
  );
}

export default IconDot;
