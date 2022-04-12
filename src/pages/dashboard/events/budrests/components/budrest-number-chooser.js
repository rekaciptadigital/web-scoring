import * as React from "react";
import styled from "styled-components";

import { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

import IconDot from "components/ma/icons/mono/dot";

import illustrationAlert from "assets/images/events/alert-publication.svg";

// Komponen berat & banyak dipakai di table, perlu di-memoize
// supaya gak render ulang terus ketika onchange search, berat.
// Kalau gak di-memo, ngetik di search jadi nge-lag.
const MemoizedCreatableSelect = React.memo(CreatableSelect);

function BudrestNumberChooser({ selectedNumber, options, onSubmit }) {
  // Buat nampilin sementara value yang diselect sebelum hit API & direfresh datanya
  const [tempSelected, setTempSelected] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);

  // Semua prop value & callback yang dioper ke React Select pelu di-memo juga
  // supaya memo komponen di atas working
  const selectedOption = React.useMemo(
    () => getSelectedFromValue(options, selectedNumber, tempSelected),
    [options, selectedNumber, tempSelected]
  );

  const handleNumberChange = React.useCallback((opt) => {
    setTempSelected(opt);
    if (!opt.isEmpty) {
      setShowAlert(true);
    } else {
      onSubmit?.(opt);
    }
  }, []);

  const handleCreateNumber = React.useCallback((inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    setTempSelected(newOption);
    onSubmit?.(newOption);
  }, []);

  const formatCreateLabel = React.useCallback((inputValue) => `Buat: "${inputValue}"`, []);

  const isOptionDisabled = React.useCallback(
    (option) => option.value === selectedNumber,
    [selectedNumber]
  );

  const customComponents = React.useMemo(() => ({ Option }), []);

  const handleCancel = () => {
    setShowAlert(false);
    setTempSelected(null);
  };

  const handleConfirm = () => {
    setShowAlert(false);
    onSubmit?.(tempSelected);
  };

  return (
    <React.Fragment>
      <StyledWrapper>
        <MemoizedCreatableSelect
          options={options}
          placeholder="-"
          value={selectedOption}
          styles={customSelectStyles}
          onChange={handleNumberChange}
          onCreateOption={handleCreateNumber}
          formatCreateLabel={formatCreateLabel}
          components={customComponents}
          isOptionDisabled={isOptionDisabled}
        />
      </StyledWrapper>
      <PromptAlert
        showAlert={showAlert}
        buttonConfirmLabel="Lanjutkan"
        onConfirm={handleConfirm}
        buttonCancelLabel={""}
        onCancel={handleCancel}
        messagePrompt={
          tempSelected?.label
            ? `Nomor Bantalan "${tempSelected.label}" Sudah Digunakan`
            : "Nomor Bantalan Ini Sudah Digunakan"
        }
        messageDescription={
          <React.Fragment>
            Nomor bantalan untuk peserta sebelumnya dengan nomor ini akan kosong.
            <br />
            Silakan dapat melanjutkan dengan memasang peserta yang tidak memiliki nomor bantalan.
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}

function Option({ children, ...props }) {
  if (props.data.__isNew__) {
    return (
      <components.Option {...props}>
        <span style={{ color: "#6a7187" }}>{children}</span>
      </components.Option>
    );
  }

  if (!props.data.isEmpty) {
    return (
      <div title="Terpakai">
        <components.Option {...props}>
          <OptionLabelWithDot>
            <span>{children}</span>
            <DotBlue>
              <IconDot size="6" />
            </DotBlue>
          </OptionLabelWithDot>
        </components.Option>
      </div>
    );
  }

  return (
    <div title="Belum terpakai">
      <components.Option {...props}>
        <OptionLabelWithDot>
          <span>{children}</span>
          <DotGray>
            <IconDot size="6" />
          </DotGray>
        </OptionLabelWithDot>
      </components.Option>
    </div>
  );
}

const StyledWrapper = styled.div`
  max-width: 5.5rem;
`;

const OptionLabelWithDot = styled.span`
  width: 100%;

  > span + span {
    margin-left: 0.375rem;
  }
`;

const DotBlue = styled.span`
  color: rgb(38, 132, 255);
`;

const DotGray = styled.span`
  color: var(--ma-gray-200);
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: undefined,
    backgroundColor: state.isDisabled ? "#eff2f7" : "#ffffff",
    borderColor: state.isDisabled ? "rgb(206, 212, 218)" : "#ced4da",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
    opacity: 0.6,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 7,
  }),
};

/* ================================== */

function PromptAlert({
  buttonConfirmLabel,
  onConfirm,
  buttonCancelLabel,
  onCancel,
  messagePrompt,
  messageDescription,
  showAlert,
}) {
  const handleCancel = () => {
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <SweetAlert
      show={showAlert}
      title=""
      custom
      btnSize="md"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
      customButtons={
        <span className="d-flex justify-content-center" style={{ gap: "0.5rem", width: "100%" }}>
          <React.Fragment>
            <Button onClick={handleCancel}>{buttonCancelLabel || "Batal"}</Button>
            <ButtonBlue onClick={handleConfirm}>{buttonConfirmLabel || "Konfirmasi"}</ButtonBlue>
          </React.Fragment>
        </span>
      }
    >
      <IllustationAlertPrompt />
      {messagePrompt && <h4>{messagePrompt}</h4>}
      {messageDescription && <p className="text-muted">{messageDescription}</p>}
    </SweetAlert>
  );
}

const IllustationAlertPrompt = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 188px;
  background-image: url(${illustrationAlert});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

/* ========================= */
// utils

function getSelectedFromValue(options, selectedNumber, tempSelected) {
  if (tempSelected) {
    return { label: tempSelected.label, value: tempSelected.value };
  }

  // Untuk cari value dari objek yang ada di option.
  // Karena kalau beda objek walaupun valuenya sama
  // nanti menu selectnya default ke atas, enggak
  // scroll ke option yang terpilih.
  const foundOption = options.find((option) => option.value === selectedNumber);
  if (foundOption) {
    return foundOption;
  }

  return { label: selectedNumber, value: selectedNumber };
}

export { BudrestNumberChooser };
