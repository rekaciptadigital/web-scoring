import * as React from "react";

function IconArrowLeftRight({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12L18 8V11H6V8L2 12L6 16V13H18V16L22 12Z" fill="currentColor" />
    </svg>
  );
}

export default IconArrowLeftRight;
