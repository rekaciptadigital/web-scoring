import * as React from "react";
import styled from "styled-components";
import Switch from "react-switch";
import { stringUtil } from "utils";

function CollapsibleDebug({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Section>
      <FieldSettingToggleBar
        label={open ? "Hide" : "Debug"}
        on={open}
        onChange={() => setOpen((on) => !on)}
      />
      {open && <pre>{JSON.stringify(children, null, 2)}</pre>}
    </Section>
  );
}

function FieldSettingToggleBar({ label, title, name, on, onChange, info, disabled }) {
  const fieldId = useFieldId(name);
  return (
    <div>
      <FieldBar title={title}>
        <Label htmlFor={fieldId}>{label}</Label>
        <ToggleSwitch name={fieldId} checked={on} onChange={onChange} disabled={disabled} />
      </FieldBar>
      {info && <Info>{info}</Info>}
    </div>
  );
}

function ToggleSwitch({ name, checked, onChange, disabled }) {
  const handleToggling = (event) => {
    onChange?.(event);
  };

  return (
    <Switch
      id={name}
      name={name}
      disabled={disabled}
      checked={Boolean(checked)}
      onChange={handleToggling}
      offColor="#eeeeee"
      onColor="#b4c6e2"
      onHandleColor="#0d47a1"
      height={16}
      width={40}
      handleDiameter={24}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    />
  );
}

/* ===================== */
// styles

const Section = styled.div`
  padding: 1.25rem;
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;
`;

const FieldBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  min-height: 3rem;
  padding: 0.5rem;
  padding-left: 1.25rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-50);
`;

const Label = styled.label`
  margin: 0;
  font-weight: 400;
  cursor: pointer;
`;

const Info = styled.div`
  margin-top: 0.25rem;
  font-size: 0.85em;
`;

/* ========================== */
// utils

function useFieldId(name) {
  return React.useMemo(() => {
    const code = stringUtil.createRandom();
    return `field-setting-${name || code}`;
  }, [name]);
}

export { CollapsibleDebug };
