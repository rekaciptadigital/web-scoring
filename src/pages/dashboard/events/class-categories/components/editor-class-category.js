import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";
import { ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { FieldInputText } from "./field-input-text";
import { FieldInputAge } from "./field-input-age";
import { FieldInputDateNarrow } from "./field-input-date-narrow";
import { SelectRadio } from "./select-radio";
import { ToggleSwitch } from "./toggle-switch";

import IconAdd from "components/ma/icons/mono/plus";

function AddClassCategory() {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <ButtonBlue onClick={() => setOpen(true)}>
        <IconAdd size="16" /> Tambah Kelas
      </ButtonBlue>

      {isOpen && <ModalEditor onClose={() => setOpen(false)} />}
    </React.Fragment>
  );
}

function ModalEditor({ onClose }) {
  const [criteria, setCriteria] = React.useState(1);
  const [ageValidator, setAgeValidator] = React.useState(null);
  const [asDate, setAsDate] = React.useState(false);

  React.useEffect(() => {
    const defaultValidatorByCriteria = { 1: null, 2: "min" };
    const validator = defaultValidatorByCriteria[criteria];
    setAgeValidator(validator);
    setAsDate(false);
  }, [criteria]);

  return (
    <Modal isOpen backdrop="static" size="lg" autoFocus onClosed={onClose}>
      <ModalBody>
        <ModalLayout>
          <h4>Buat Kelas Baru</h4>

          <Fields>
            <FieldInputText
              label="Nama Kelas"
              name="class-label"
              required
              placeholder="Masukkan nama kelas, contoh: U-15"
            />

            <FieldControl>
              <span className="field-label">Kriteria Kelas</span>
              <SelectRadio
                name="class-criteria"
                options={[
                  { label: "Umum", value: 1 },
                  { label: "Usia", value: 2 },
                ]}
                defaultValue={1}
                value={criteria}
                onChange={(criteriaId) => setCriteria(parseInt(criteriaId))}
              />
            </FieldControl>

            <Show when={criteria === 2}>
              <SplitFields>
                <FieldControl>
                  <span className="field-label">Ketentuan Usia</span>
                  <SelectRadio
                    name="class-age-checker"
                    options={[
                      { label: "Usia Minimum", value: "min" },
                      { label: "Usia Maksimum", value: "max" },
                      { label: "Rentang Usia", value: "range" },
                    ]}
                    defaultValue={1}
                    value={ageValidator}
                    onChange={(validator) => setAgeValidator(validator)}
                  />
                </FieldControl>

                <FieldToggle>
                  <ToggleSwitch
                    label="Berdasarkan Tanggal"
                    name="as-date"
                    checked={asDate}
                    onChange={() => setAsDate((on) => !on)}
                  />
                </FieldToggle>
              </SplitFields>

              <Show when={!asDate}>
                <Show when={ageValidator === "min"}>
                  <FieldInputAge
                    label="Usia Minimum"
                    name="age-min"
                    required
                    placeholder="Misal: 15"
                  />
                </Show>

                <Show when={ageValidator === "max"}>
                  <FieldInputAge
                    label="Usia Maksimum"
                    name="age-max"
                    required
                    placeholder="Misal: 15"
                  />
                </Show>

                <Show when={ageValidator === "range"}>
                  <SplitFields>
                    <FieldInputAge
                      label="Usia Minimum"
                      name="age-min"
                      required
                      placeholder="Misal: 15"
                    />
                    <FieldInputAge
                      label="Usia Maksimum"
                      name="age-max"
                      required
                      placeholder="Misal: 15"
                    />
                  </SplitFields>
                </Show>
              </Show>

              <Show when={asDate}>
                <Show when={ageValidator === "min"}>
                  <FieldInputDateNarrow
                    label="Tanggal Lahir Minimum"
                    required
                    name="birthdate-min"
                  />
                </Show>

                <Show when={ageValidator === "max"}>
                  <FieldInputDateNarrow
                    label="Tanggal Lahir Maksimum"
                    required
                    name="birthdate-max"
                  />
                </Show>

                <Show when={ageValidator === "range"}>
                  <SplitFields>
                    <FieldInputDateNarrow
                      label="Tanggal Lahir Minimum"
                      required
                      name="birthdate-min"
                    />
                    <FieldInputDateNarrow
                      label="Tanggal Lahir Maksimum"
                      required
                      name="birthdate-max"
                    />
                  </SplitFields>
                </Show>
              </Show>
            </Show>
          </Fields>

          <BottomActions>
            <ButtonOutlineBlue onClick={onClose}>Batal</ButtonOutlineBlue>
            <ButtonBlue onClick={onClose}>Simpan</ButtonBlue>
          </BottomActions>
        </ModalLayout>
      </ModalBody>
    </Modal>
  );
}

function Show({ children, when }) {
  return when ? children : null;
}

/* ================================= */
// styles

const ModalLayout = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const BottomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Fields = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const FieldControl = styled.div`
  > * {
    display: block;

    + * {
      margin-top: 0.25rem;
    }
  }

  .field-label {
    color: var(--ma-gray-600);
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const SplitFields = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
`;

const FieldToggle = styled.div`
  align-self: flex-end;
  margin-bottom: 0.25rem;
`;

export { AddClassCategory };
