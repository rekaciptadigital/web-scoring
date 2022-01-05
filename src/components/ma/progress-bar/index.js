import styled from "styled-components";

const ProgressBarLine = styled.div`
  --bar-scale: ${(p) => p.value || 1};

  overflow: hidden;
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 8px;
  background-color: #efefef;

  &::before {
    content: " ";

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: #276ef1;
    transform-origin: left;
    transform: scaleX(var(--bar-scale));
    transition: transform 0.5s;
  }
`;

export { ProgressBarLine };
