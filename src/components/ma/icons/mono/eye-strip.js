import * as React from "react";

function IconEyeStrip({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#a)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M6.6 2.827a6.08 6.08 0 0 1 1.4-.16C12.667 2.667 15.333 8 15.333 8c-.404.757-.887 1.47-1.44 2.127m-4.48-.714a2 2 0 1 1-2.826-2.826m5.373 5.373A6.714 6.714 0 0 1 8 13.333C3.333 13.333.667 8 .667 8A12.3 12.3 0 0 1 4.04 4.04l7.92 7.92Z"
          strokeWidth={1.5}
        />
        <path d="m.667.667 14.666 14.666" strokeWidth={2} />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconEyeStrip;
