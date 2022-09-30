import * as React from "react";

function IconMoreVertical({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 15.167a1.167 1.167 0 1 0 0-2.334 1.167 1.167 0 0 0 0 2.334ZM14 7a1.167 1.167 0 1 0 0-2.333A1.167 1.167 0 0 0 14 7ZM14 23.333A1.167 1.167 0 1 0 14 21a1.167 1.167 0 0 0 0 2.333Z"
        stroke="#0D47A1"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IconMoreVertical;
