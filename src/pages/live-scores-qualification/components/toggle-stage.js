import * as React from "react";
import styled from "styled-components";
import { useDisplaySettings } from "../contexts/display-settings";
import IconDot from "components/ma/icons/mono/dot";

function ToggleStage() {
  const { isQualification, isElimination, setStage } = useDisplaySettings();
  return (
    <ToggleWrapper>
      <span>
        <InputToggleItem
          type="radio"
          name="stage"
          id="stage-qualification"
          value="qualification"
          checked={isQualification}
          onChange={(ev) => setStage(ev.target.value)}
        />
        <ToggleButton htmlFor="stage-qualification">
          <span>
            <IconDot size="0.625em" />
          </span>
          <span>Qualification</span>
        </ToggleButton>
      </span>

      <span>
        <InputToggleItem
          type="radio"
          name="stage"
          id="stage-elimination"
          value="elimination"
          checked={isElimination}
          onChange={(ev) => setStage(ev.target.value)}
        />
        <ToggleButton htmlFor="stage-elimination">
          <span>
            <IconDot size="0.625em" />
          </span>
          <span>Elimination</span>
        </ToggleButton>
      </span>
    </ToggleWrapper>
  );
}

const ToggleWrapper = styled.div`
  display: inline-block;

  > * + * {
    margin-left: 0.5rem;
  }
`;

const InputToggleItem = styled.input`
  position: absolute;
  top: -1000px;
  left: -1000px;
  visibility: hidden;
  margin: 0;
`;

const ToggleButton = styled.label`
  cursor: pointer;
  margin: 0;
  padding: 0.5rem 0.875rem;
  border-radius: 0.15rem;
  background-color: var(--ma-gray-200);
  font-weight: 400;

  > * + * {
    margin-left: 0.5rem;
  }

  > *:nth-child(1) {
    color: var(--ma-gray-400);
  }

  &:hover > *:nth-child(1) {
    color: var(--ma-field-focused);
  }

  input:checked + & {
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);

    > *:nth-child(1) {
      color: var(--ma-field-focused);
    }
  }

  /* TODO: focus state */
`;

export { ToggleStage };
