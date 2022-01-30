import * as React from "react";
import styled from "styled-components";

const ComingSoonWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;

  .overlay {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0);
    transition: all 0.4s;

    .text-label {
      padding: 10px 20px;
      border-radius: 2em;
      background-color: #ffffff;
      font-weight: 600;
      opacity: 0;
      transform: translateY(1em);
      transition: transform 0.2s;
    }
  }

  &:hover {
    .overlay {
      background-color: rgba(0, 0, 0, 0.6);

      .text-label {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .option-card {
      filter: blur(3px);
    }
  }
`;

export default function OptionComingSoon({ children, ...props }) {
  return (
    <ComingSoonWrapper {...props}>
      <div className="overlay">
        <span className="text-label">Coming Soon</span>
      </div>
      {children}
    </ComingSoonWrapper>
  );
}
