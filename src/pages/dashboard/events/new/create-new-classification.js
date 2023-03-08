import ArrowLeft from "components/icons/ArrowLeft";
import { Button, ButtonBlue, LoadingScreen } from "components/ma";
import IconDot from "components/ma/icons/mono/dot";
import IconPlus from "components/ma/icons/mono/plus";
import { selectConstants } from "constants/index";
import React from "react";
import { Input, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { stringUtil } from "utils";
import CardClassificationList from "./components/card-classification-list";
import TableClassification from "./components/table-classification";
import {
  fetchClassification,
  useClassificationFormData,
} from "./hooks/form-classification";

const CreateNewClassification = ({ classification, userData }) => {
  const { newClassification, setNewClassification } = classification;
  const { userProfile } = userData;
  const [showModalAdd, setModalAdd] = React.useState(false);
  const [showError, setShowError] = React.useState("");
  const [newCategoryInput, setNewCategoryInput] = React.useState("");
  const [contentType, setContentType] = React.useState("list");
  const [itemSelectedForEdit, setItemSelectedForEdit] = React.useState({});
  const [onRefreshData, setOnRefreshData] = React.useState(null);
  const [newDataUpdate, setNewDataUpdate] = React.useState({});
  const { deleteParent } = useClassificationFormData();
  const { submitDelete: onDeleteParent, isLoading: isLoadingDeleteParent } =
    deleteParent;
  const [selectRadio, setSelectRadio] = React.useState(
    selectConstants.classificationOption[0].value
  );
  const { parentClassificationList } = fetchClassification(
    null,
    contentType,
    onRefreshData
  );
  const parentList = React.useMemo(() => {
    const data = parentClassificationList?.data?.filter(
      (value) => value.detailAdmin?.id === userProfile?.id
    );
    let result;
    if (contentType === "editmode" && newDataUpdate?.id) {
      const updateData = data.map((prevData) => {
        if (prevData.id === newDataUpdate.id) {
          return { ...newDataUpdate };
        } else {
          return { ...prevData };
        }
      });
      result = updateData;
    } else {
      result = data;
    }
    return result;
  }, [parentClassificationList, contentType, newDataUpdate]);
  const onDeleteClassification = (id) => {
    const options = {
      onSuccess: () => {
        setContentType("list");
        setOnRefreshData(false);
      },
    };
    setOnRefreshData(true);
    onDeleteParent(options, id);
  };
  const handleSaveCategory = () => {
    const checkClassification = parentList.filter(
      (val) => val.title?.toLowerCase() === newCategoryInput.toLocaleLowerCase()
    );
    if (!checkClassification?.length) {
      const data = {
        id: stringUtil.createRandom(),
        parentTitleClassification: newCategoryInput,
        childrenClassification: [
          { id: stringUtil.createRandom(), title: "", status: 1 },
        ],
      };
      setContentType("addnew");
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
        {contentType === "list" ? (
          <ButtonBlue
            onClick={() => {
              setModalAdd(!showModalAdd);
              setShowError("");
            }}
          >
            <IconPlus size={16} /> Tambah Klasifikasi
          </ButtonBlue>
        ) : null}
      </HeadingBox>

      {contentType === "list" ? (
        <>
          <LoadingScreen
            loading={isLoadingDeleteParent}
            message="Sedang menghapus parent..."
          />
          {parentList?.length ? (
            parentList?.map((parentClassification, index) => (
              <CardClassificationList
                key={parentClassification?.id}
                indexNumber={index + 1}
                title={parentClassification?.title}
                subtitle={parentClassification?.childrens
                  ?.map((val) => val.title)
                  .join("; ")}
                onEditClassification={() => {
                  setContentType("editmode");
                  setItemSelectedForEdit(parentClassification);
                }}
                onDeleteClassification={() =>
                  onDeleteClassification(parentClassification?.id)
                }
              />
            ))
          ) : (
            <EmptyList>Belum ada data klasifikasi.</EmptyList>
          )}
        </>
      ) : contentType === "addnew" && Object.keys(newClassification).length ? (
        <TableClassification
          data={newClassification}
          setNewClassification={setNewClassification}
          setContentType={setContentType}
          classification={classification}
        />
      ) : contentType === "editmode" ? (
        <TableClassification
          data={itemSelectedForEdit}
          setNewClassification={setNewClassification}
          classification={classification}
          editMode
          setContentType={setContentType}
          setNewDataUpdate={setNewDataUpdate}
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
            {showError ? (
              <ErrorText className="danger-text">{showError}</ErrorText>
            ) : null}
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

const EmptyList = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  min-height: 25vh;
  font-size: 24px;
  font-weight: 700;
  @media (max-width: 420px) {
    font-size: 18px;
    text-align: center;
  }
`;

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

  &.danger-text {
    color: red;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 20px;
  padding: 20px 0;
  width: 100%;

  @media (max-width: 376px) {
    justify-content: center;
  }
`;

const DotRadioButtonIndicator = styled.div`
  padding: 4px;
  border-radius: 50%;
  border: 2px solid #0d47a1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &.radio-checked {
    background: #0d47a1;
  }
`;

const RadioButton = styled.input`
  display: none;
`;

const RadioLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  color: #1c1c1c;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 12px;
  width: 100%;

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
  @media (max-width: 650px) {
    width: 95%;
  }
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
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: start;
    gap: 10px;
  }
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

export default CreateNewClassification;
