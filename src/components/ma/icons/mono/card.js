import * as React from "react";

function IconCard({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.7808 1.33301H3.44743C3.07924 1.33301 2.78076 1.63148 2.78076 1.99967V13.9997C2.78076 14.3679 3.07924 14.6663 3.44743 14.6663H12.7808C13.149 14.6663 13.4474 14.3679 13.4474 13.9997V1.99967C13.4474 1.63148 13.149 1.33301 12.7808 1.33301Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12H15V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IconCard;
