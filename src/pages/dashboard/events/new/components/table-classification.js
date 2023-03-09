import { Button, ButtonBlue, LoadingScreen } from "components/ma";
import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";
import { selectConstants } from "constants/index";
import React from "react";
import { Input } from "reactstrap";
import styled from "styled-components";
import { stringUtil } from "utils";
import { useClassificationFormData } from "../hooks/form-classification";

const TableClassification = ({
  data,
  // classification,
  editMode,
  setContentType,
  setNewDataUpdate,
}) => {
  // const { setChangeView } = classification;
  const [classificationData, setClassificationData] = React.useState(null);
  const { createNew, updateParent } = useClassificationFormData();
  const [errorDuplicateChildren, setErrorDuplicateChildren] =
    React.useState("");
  const {
    submit: submitNewClassification,
    isLoading: isSubmitNewClassification,
  } = createNew;
  const {
    submitUpdate: submitUpdateClassification,
    isLoading: isSubmitUpdateClassification,
  } = updateParent;
  const onChangeNameParentClassification = (event) => {
    const val = event.target.value;
    const prevData = {
      ...classificationData,
      parentTitleClassification: val,
    };
    setClassificationData(prevData);
  };

  const onChangeNameChildrenClassification = (event, value) => {
    const newName = event.target.value;

    const checkedChildrenHasBeenAdded =
      classificationData?.childrenClassification?.filter(
        (val) => val.title?.toLowerCase() === newName?.toLowerCase()
      );

    if (checkedChildrenHasBeenAdded?.length) {
      setErrorDuplicateChildren(`Nama klasifikasi ${newName} sudah ada`);
    } else {
      setErrorDuplicateChildren("");
    }
    const prevDataCategory = classificationData?.childrenClassification?.map(
      (val) => {
        if (val.id === value.id) {
          return { ...val, title: newName };
        } else {
          return { ...val };
        }
      }
    );
    const prevData = {
      ...classificationData,
      childrenClassification: prevDataCategory,
    };
    setClassificationData(prevData);
  };
  const onAddItem = () => {
    const prevData = [
      ...classificationData?.childrenClassification,
      { id: stringUtil.createRandom(), title: "", status: 1 },
    ];
    const editDataClassification = {
      ...classificationData,
      childrenClassification: prevData,
    };
    setClassificationData(editDataClassification);
  };
  const onDeleteItem = (id) => {
    if (classificationData.childrenClassification?.length > 1) {
      const newData = classificationData?.childrenClassification?.filter(
        (val) => val.id !== id
      );
      setClassificationData({
        ...classificationData,
        childrenClassification: newData,
      });
    }
  };
  const onSaveClassification = () => {
    const children = classificationData?.childrenClassification
      .filter((val) => val.title.length)
      .map((val) => ({ title: val.title, status: val.status }));
    const options = {
      onSuccess: () => {
        if (editMode) {
          setNewDataUpdate(data);
          setContentType("list");
        } else {
          setContentType("list");
        }
      },
    };
    const payload = {
      parent_title: classificationData.parentTitleClassification,
      childrens: children,
    };
    if (editMode) {
      payload.status = data?.status;
      submitUpdateClassification(payload, options, { id: data.id });
    } else {
      payload.parent_status = 1;
      submitNewClassification(payload, options);
    }
  };
  React.useEffect(() => {
    if (editMode) {
      const newData = {
        parentTitleClassification: data.title,
        childrenClassification: data.childrens,
        status: data.status,
      };
      setClassificationData(newData);
    } else {
      setClassificationData(data);
    }
  }, [data]);
  const checkingData = classificationData?.childrenClassification?.map(
    (val, index) => {
      if (val.title?.length) {
        return true;
      } else {
        if (
          classificationData?.childrenClassification?.length > 2 &&
          index === classificationData?.childrenClassification?.length - 1
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  );
  const dataFilled = checkingData?.every(Boolean);
  return (
    <TableWrapper>
      <LoadingScreen
        loading={isSubmitUpdateClassification || isSubmitNewClassification}
        message="Sedang menyimpan data..."
      />
      <div style={{ marginBottom: "10px" }}>
        <TableHeaderText>Nama Klasifikasi </TableHeaderText>
        <Input
          value={classificationData?.parentTitleClassification ?? ""}
          onChange={(event) => onChangeNameParentClassification(event, data)}
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
            {classificationData?.childrenClassification?.map((value, index) => (
              <tr key={value.id}>
                <td>{index + 1}</td>
                <td className="input-field">
                  <Input
                    value={value?.title ?? ""}
                    onChange={(event) =>
                      onChangeNameChildrenClassification(event, value)
                    }
                  />
                </td>
                <td>
                  <IconBox className="icon-btn">
                    {index !==
                    classificationData?.childrenClassification?.length - 1 ? (
                      <div
                        className={`${
                          classificationData?.childrenClassification?.length <=
                          1
                            ? "disable-btn"
                            : ""
                        }`}
                        onClick={() => onDeleteItem(value.id)}
                      >
                        <IconTrash size={16} />
                      </div>
                    ) : (
                      <>
                        <div
                          className={`${
                            classificationData?.childrenClassification
                              ?.length <= 1
                              ? "disable-btn"
                              : ""
                          }`}
                          onClick={() => onDeleteItem(value.id)}
                        >
                          <IconTrash size={16} />
                        </div>
                        <div aria-hidden="true" onClick={onAddItem}>
                          <IconPlus size={16} />
                        </div>
                      </>
                    )}
                  </IconBox>
                </td>
              </tr>
            ))}
          </tbody>
          {classificationData?.childrenClassification?.length < 2 ||
          dataFilled === false ||
          errorDuplicateChildren?.length ? (
            <ErrorText className="danger-text">
              {classificationData?.childrenClassification?.length < 2
                ? "Buat minimum 2 tipe nama klasifikasi"
                : dataFilled === false
                ? "Field harus di isi"
                : errorDuplicateChildren}
            </ErrorText>
          ) : null}
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
            onClick={() => setContentType("list")}
          >
            Kembali
          </Button>
          <ButtonBlue
            disabled={
              classificationData?.childrenClassification?.length < 2 ||
              dataFilled === false ||
              errorDuplicateChildren?.length
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
  padding: 40px 20px 20px;
  @media (max-width: 375px) {
    flex-direction: column;
    gap: 10px;
    padding: 0;
  }
`;

const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 6px;

  > *:nth-child(1) {
    color: red;
    &.disable-btn {
      opacity: 0.5;
      cursor: auto;
    }
  }
  &.disable-btn:hover {
    cursor: auto;
  }

  > *:nth-child(2) {
    padding: 1px;
    margin: auto;
    border: 1px solid #afafaf;
    color: #afafaf;
    border-radius: 50%;
  }

  > *:nth-child(2):hover {
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
      width: 100%;
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

const ErrorText = styled.div`
  margin-top: 8px;
  color: #afafaf;
  font-weight: 400;
  font-size: 12px;

  &.danger-text {
    color: red;
  }
`;

export default TableClassification;
