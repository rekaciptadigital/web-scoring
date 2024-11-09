import React from "react";

// Functional Component untuk ArrowLeft
const ArrowLeft = () => {
  return (
    <svg
      width="6"
      height="8"
      viewBox="0 0 6 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 7L1.5 4L4.5 1"
        stroke="#0D47A1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Membungkus komponen dengan React.memo untuk mencegah rerendering yang tidak perlu
export default React.memo(ArrowLeft);