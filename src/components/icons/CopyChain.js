import * as React from "react";

// Functional Component untuk CopyChain
const CopyChain = () => {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.3335 11.31C8.69137 11.7885 9.14796 12.1843 9.67229 12.4708C10.1966 12.7573 10.7764 12.9276 11.3724 12.9703C11.9683 13.013 12.5665 12.927 13.1263 12.7182C13.6861 12.5094 14.1944 12.1826 14.6168 11.76L17.1168 9.26003C17.8758 8.47419 18.2958 7.42168 18.2863 6.32919C18.2768 5.2367 17.8386 4.19165 17.0661 3.41912C16.2935 2.64659 15.2485 2.20838 14.156 2.19889C13.0635 2.18939 12.011 2.60937 11.2252 3.36836L9.79183 4.79336"
        stroke="#31447E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6668 9.64309C11.309 9.16465 10.8524 8.76877 10.328 8.48231C9.80371 8.19584 9.22391 8.02549 8.62796 7.98281C8.03201 7.94013 7.43384 8.02612 6.87405 8.23494C6.31425 8.44376 5.8059 8.77053 5.3835 9.19309L2.8835 11.6931C2.12451 12.4749 1.70375 13.5294 1.71431 14.6232C1.72488 15.7171 2.16593 16.762 2.94256 17.5386C3.71919 18.3152 4.76404 18.7562 5.85784 18.7668C6.95163 18.7774 8.00617 18.3567 8.78795 17.5977L10.2128 16.1727"
        stroke="#31447E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Membungkus komponen dengan React.memo untuk mencegah rerendering yang tidak perlu
export default React.memo(CopyChain);
