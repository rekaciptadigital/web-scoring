import React from "react";

function IconMedal({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 2H15.5L13.5 7.15C14.5872 7.37257 15.6115 7.83327 16.4994 8.49896C17.3873 9.16465 18.1166 10.0188 18.635 11L22 2ZM8.5 2H2L5.365 11C5.88338 10.0188 6.61273 9.16465 7.50061 8.49896C8.38849 7.83327 9.41283 7.37257 10.5 7.15L8.5 2Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 14.5C19.5 18.642 16.142 22 12 22C7.858 22 4.5 18.642 4.5 14.5C4.5 13.236 4.8125 12.045 5.365 11C5.88338 10.0188 6.61273 9.16465 7.50061 8.49896C8.38849 7.83327 9.41283 7.37257 10.5 7.15C10.985 7.0515 11.4865 7 12 7C12.5135 7 13.015 7.0515 13.5 7.15C14.5872 7.37257 15.6115 7.83327 16.4994 8.49896C17.3873 9.16465 18.1166 10.0188 18.635 11C19.2049 12.0785 19.5019 13.2802 19.5 14.5V14.5Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17.5V11L10.5 11.5M12 17.5H14M12 17.5H10"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IconMedal;
