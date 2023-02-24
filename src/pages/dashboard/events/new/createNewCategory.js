import ArrowLeft from "components/icons/ArrowLeft";
import { Button, ButtonBlue } from "components/ma";
import IconDot from "components/ma/icons/mono/dot";
import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";
import { selectConstants } from "constants/index";
import React from "react";
import { Input, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { stringUtil } from "utils";

const TableClassification = ({
  data,
  setNewClassification,
  classification,
}) => {
  const { setChangeView, setClassification } = classification;
  const [classificationData, setClassificationData] = React.useState(null);
  const onChangeNameClassification = (event) => {
    const val = event.target.value;
    const prevData = {
      ...classificationData,
      classificationName: val,
    };
    setClassificationData(prevData);
  };
  const onChangeNameCategory = (event, value) => {
    const newName = event.target.value;
    const prevDataCategory = classificationData?.categoriesName?.map((val) => {
      if (val.id === value.id) {
        return { ...val, name: newName };
      } else {
        return { ...val };
      }
    });
    const prevData = {
      ...classificationData,
      categoriesName: prevDataCategory,
    };
    setClassificationData(prevData);
  };
  const onAddItem = () => {
    const prevData = [
      ...classificationData?.categoriesName,
      { id: stringUtil.createRandom(), name: "" },
    ];
    setNewClassification({ ...classificationData, categoriesName: prevData });
  };
  const onDeleteItem = (id) => {
    const newData = classificationData?.categoriesName?.filter(
      (val) => val.id !== id
    );
    setNewClassification({ ...classificationData, categoriesName: newData });
  };
  const onSaveClassification = () => {
    const newClassification = {
      label: `${classificationData?.classificationName} (${classificationData?.categoriesName?.length})`,
      value: classificationData?.classificationName?.split(" ").join(""),
      data: classificationData?.categoriesName,
    };
    setClassification(newClassification);
    setChangeView(1);
    setNewClassification([]);
  };
  React.useEffect(() => {
    setClassificationData(data);
  }, [data]);
  const checkingData = classificationData?.categoriesName?.map((val) => {
    if (val.name.length) {
      return true;
    } else {
      return false;
    }
  });
  const dataFilled = checkingData?.every(Boolean);
  return (
    <TableWrapper>
      <div style={{ marginBottom: "10px" }}>
        <TableHeaderText>Nama Klasifikasi </TableHeaderText>
        <Input
          value={classificationData?.classificationName}
          onChange={(event) => onChangeNameClassification(event, data)}
          key={"field-classification-name-" + data.id}
        />
      </div>
      <div>
        <TableListParticipant className="list-table-participant">
          <thead>
            <tr>
              {selectConstants.tableClassificationMenuTab.map((menu, index) => (
                <th
                  key={menu?.id}
                  className={`${index === 1 ? "input-field" : ""}`}
                >
                  {menu.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classificationData?.categoriesName?.map((value, index) => (
              <tr key={value.id}>
                <td>{index + 1}</td>
                <td className="input-field">
                  <Input
                    value={value?.name}
                    onChange={(event) => onChangeNameCategory(event, value)}
                  />
                </td>
                <td>
                  <IconBox
                    className={`${
                      index !== classificationData?.categoriesName?.length - 1
                        ? "delete-icon"
                        : "plus-icon"
                    }`}
                  >
                    {index !==
                    classificationData?.categoriesName?.length - 1 ? (
                      <div onClick={() => onDeleteItem(value.id)}>
                        <IconTrash size={16} />
                      </div>
                    ) : (
                      <div aria-hidden="true" onClick={onAddItem}>
                        <IconPlus size={16} />
                      </div>
                    )}
                  </IconBox>
                </td>
              </tr>
            ))}
          </tbody>
        </TableListParticipant>
        <ButtonTableWrapper>
          <Button
            style={{
              backgroundColor: "transparent",
              border: "1px solid #0D47A1",
              padding: "8px 16px",
              borderRadius: "8px",
              color: "#0D47A1",
              fontWeight: 600,
              fontSize: "14px",
            }}
            onClick={() => setChangeView(1)}
          >
            Kembali
          </Button>
          <ButtonBlue
            disabled={
              classificationData?.categoriesName?.length < 2 ||
              dataFilled === false
            }
            onClick={onSaveClassification}
          >
            Simpan
          </ButtonBlue>
        </ButtonTableWrapper>
      </div>
    </TableWrapper>
  );
};

const ButtonTableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px 20px 0;
`;

const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &.delete-icon {
    color: red;
  }
  &.plus-icon {
    width: 20px;
    height: 20px;
    margin: auto;
    border: 1px solid #afafaf;
    color: #afafaf;
    border-radius: 50%;
  }
  &.plus-icon:hover {
    color: gray;
    border: 1px solid gray;
  }
`;

const TableListParticipant = styled.table`
  width: 100%;
  min-height: 50vh;
  border-collapse: separate;
  border-spacing: 0 0.25rem;
  display: block;
  overflow: auto;
  &.list-table-participant {
    &::-webkit-scrollbar {
      height: 5px;
      background: #eff2f7;
    }
    &::-webkit-scrollbar-track {
      border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb {
      background: #c0c0c0;
      border-radius: 20px;
    }
  }

  th,
  td {
    cursor: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  thead > tr > th {
    padding: 0.75rem;
    background-color: var(--ma-primary-blue-50);

    &.input-field {
      width: 90%;
    }
  }

  tbody > tr > td {
    padding: 0.8125rem 0.625rem;
    background-color: #ffffff;
    font-size: 0.875em;
    border-bottom: 2px solid #eff2f7;

    &.input-field {
      width: 90%;
    }

    .css-1okebmr-indicatorSeparator {
      background-color: white;
    }
  }
`;

const TableHeaderText = styled.div`
  padding: 12px 16px;
  background: #e7edf6;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  color: black;
  margin-bottom: 20px;
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 8px;
  margin: 24px 0;
`;

const CreateNewCategory = ({ classification }) => {
  const {
    newClassification,
    setNewClassification,
    classification: classificationOption,
  } = classification;
  const [showModalAdd, setModalAdd] = React.useState(false);
  const [showError, setShowError] = React.useState("");
  const [newCategoryInput, setNewCategoryInput] = React.useState("");
  const [selectRadio, setSelectRadio] = React.useState(
    selectConstants.classificationOption[0].value
  );
  const handleSaveCategory = () => {
    const checkClassification = classificationOption.filter(
      (val) =>
        val.value?.toLowerCase() === newCategoryInput.toLocaleLowerCase() ||
        val.labe?.toLowerCase() === newCategoryInput.toLocaleLowerCase()
    );
    if (!checkClassification?.length) {
      const data = {
        id: stringUtil.createRandom(),
        classificationName: newCategoryInput,
        categoriesName: [{ id: stringUtil.createRandom(), name: "" }],
      };
      setNewClassification(data);
      setModalAdd(false);
    } else {
      setShowError("Nama klasifikasi telah tersedia");
    }
  };
  return (
    <ContainerWrapper>
      <NavigationWrapper onClick={() => classification.setChangeView(1)}>
        <NavigationIcon>
          <ArrowLeft />
        </NavigationIcon>
        <NavigationText>Kembali</NavigationText>
      </NavigationWrapper>
      <HeadingBox>
        <HeadingTitleBox>
          <HeadingTitle>Pengaturan Klasifikasi</HeadingTitle>
          <HeadingSubtitle>Pengaturan Klasifikasi Peserta</HeadingSubtitle>
        </HeadingTitleBox>
        {!Object.keys(newClassification).length ? (
          <ButtonBlue onClick={() => setModalAdd(!showModalAdd)}>
            <IconPlus size={16} /> Tambah Klasifikasi
          </ButtonBlue>
        ) : null}
      </HeadingBox>
      {Object.keys(newClassification).length ? (
        <TableClassification
          data={newClassification}
          setNewClassification={setNewClassification}
          classification={classification}
        />
      ) : null}

      {showModalAdd ? (
        <StyledBSModal
          size="xl"
          isOpen={showModalAdd}
          onClosed={() => setModalAdd(false)}
          centered
        >
          <StyledBSModalBody>
            <ModalTitle>Tambah Klasifikasi baru</ModalTitle>
            <Input
              placeholder="Masukan nama klasifikasi"
              onChange={(ev) => setNewCategoryInput(ev.target.value)}
              style={{ borderColor: showError ? "red" : "gray" }}
            />
            {showError ? <ErrorText>{showError}</ErrorText> : null}
            <RadioButtonBox>
              {selectConstants.classificationOption.map((classification) => (
                <div key={classification.value}>
                  <RadioButton
                    type={"radio"}
                    value={classification.value}
                    checked={classification.value === selectRadio}
                    disabled={classification.value === "fromRegistrant"}
                    onChange={(val) => setSelectRadio(val.target.value)}
                  />
                  <RadioLabel
                    className={`${
                      classification.value === "fromRegistrant"
                        ? "disabled-indicator"
                        : ""
                    }`}
                  >
                    <DotRadioButtonIndicator
                      className={`${
                        selectRadio === classification.value
                          ? "radio-checked"
                          : ""
                      } `}
                    >
                      <IconDot size="0.5rem" />
                    </DotRadioButtonIndicator>
                    <span>{classification.label}</span>
                  </RadioLabel>
                </div>
              ))}
            </RadioButtonBox>
            <ButtonWrapper>
              <Button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #0D47A1",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  color: "#0D47A1",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
                onClick={() => setModalAdd(false)}
              >
                Batal
              </Button>
              <ButtonBlue onClick={handleSaveCategory}>Simpan</ButtonBlue>
            </ButtonWrapper>
          </StyledBSModalBody>
        </StyledBSModal>
      ) : null}
    </ContainerWrapper>
  );
};

const NavigationWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 40px;
  cursor: pointer;
`;

const NavigationText = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #545454;
`;

const NavigationIcon = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.div`
  margin-top: 8px;
  color: #afafaf;
  font-weight: 400;
  font-size: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 20px;
  padding: 20px 0;
  width: 100%;
`;

const DotRadioButtonIndicator = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #0d47a1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;

  &.radio-checked {
    background: #0d47a1;
  }
`;

const RadioButton = styled.input`
  width: 22px;
  height: 22px;
  display: none;
`;

const RadioLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  color: #1c1c1c;
  display: flex;
  gap: 12px;

  &.disabled-indicator {
    opacity: 0.5;
  }
`;

const ModalTitle = styled.h1`
  font-weight: 600;
  font-size: 14px;
  color: #1c1c1c;
  margin-bottom: 12px;
`;

const StyledBSModal = styled(Modal)`
  .modal-content {
    border-radius: 0.5rem;
  }
  width: 45%;
`;

const RadioButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`;

const StyledBSModalBody = styled(ModalBody)`
  font-family: "Inter", sans-serif;
  width: 100%;
`;

const ContainerWrapper = styled.div`
  padding: 30px 24px;
`;

const HeadingBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeadingTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeadingTitle = styled.h1`
  font-weight: 500;
  font-size: 24px;
`;
const HeadingSubtitle = styled.h1`
  font-weight: 400;
  font-size: 14px;
  color: #545454;
`;

export default CreateNewCategory;
