import * as React from "react";
import styled from "styled-components";
import { useStepScreen } from "./hooks/step-screen";

function StepListIndicator({ children, title }) {
  const { registerStepContent } = useStepScreen();

  const childrenItemsList = React.useMemo(() => {
    return React.Children.toArray(children);
  }, [children]);

  React.useEffect(() => {
    if (!childrenItemsList?.length) {
      return;
    }

    const stepsData = childrenItemsList.map((child, index) => ({
      sequence: index + 1,
      stepId: child.props.id,
      index: index,
    }));

    registerStepContent(stepsData);
  }, [childrenItemsList]);

  return (
    <StyledListIndicator>
      {title && <Title>{title}</Title>}

      {childrenItemsList.length ? (
        <ol className="steps-list">
          {childrenItemsList.map((child) => (
            <li key={child.props.id}>{child}</li>
          ))}
        </ol>
      ) : (
        <div>Tidak ada item step</div>
      )}
    </StyledListIndicator>
  );
}

const StyledListIndicator = styled.div`
  background-color: var(--ma-blue);
  border-radius: 8px;
  overflow: hidden;

  ul.steps-list,
  ol.steps-list {
    list-style: none;
    padding: 0;
    margin: 0;

    overflow-x: scroll;
    display: flex;
  }

  @media (min-width: 768px) {
    position: sticky;
    top: calc(70px + 2.5rem);
    z-index: 100;

    padding: 1.25rem 0;

    ul.steps-list,
    ol.steps-list {
      display: block;
      overflow-x: visible;
    }
  }
`;

const Title = styled.div`
  padding: 0.75rem 1.25rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #ffffff;

  @media (min-width: 768px) {
    padding: 0.625rem 2.5rem;
  }
`;

export { StepListIndicator };
