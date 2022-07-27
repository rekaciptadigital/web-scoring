import * as React from "react";
import styled from "styled-components";
import { useSubmitArchiveAgeCategory } from "../hooks/submit-archive-age-category";

import { ButtonGhostBlue, LoadingScreen, AlertSubmitError } from "components/ma";
import { EditClassCategory, ViewClassCategory } from "./editor-class-category";
import { ConfirmPrompt } from "./confirm-prompt";
import { AlertSuccess } from "./alert-success";

import IconEye from "components/ma/icons/mono/eye";
import IconEdit from "components/ma/icons/mono/edit";
import IconTrash from "components/ma/icons/mono/trash";

import { datetime } from "utils";
import { parseAgeCategoryResponseData } from "../utils";

function ClassCategoryItem({ classCategory, onSuccessSubmit }) {
  return (
    <ItemWrapper>
      <ItemMain>
        <ItemBody>
          <ClassLabel>{classCategory.label}</ClassLabel>
          <ClassDescription classCategory={classCategory} />
        </ItemBody>

        <ItemActions>
          {classCategory.eoId && classCategory.canUpdate ? (
            <EditClassCategory
              ageCategoryId={classCategory.id}
              renderButton={({ onOpen }) => (
                <ButtonGhostBlue flexible onClick={onOpen}>
                  <IconEdit size="16" />
                </ButtonGhostBlue>
              )}
              onSuccessSubmit={onSuccessSubmit}
            />
          ) : (
            <ViewClassCategory
              ageCategoryId={classCategory.id}
              renderButton={({ onOpen }) => (
                <ButtonGhostBlue flexible onClick={onOpen}>
                  <IconEye size="16" />
                </ButtonGhostBlue>
              )}
            />
          )}

          <Show when={classCategory.eoId && classCategory.canUpdate}>
            <ArchiveClassCategory
              classCategory={classCategory}
              onSuccessArchive={onSuccessSubmit}
            />
          </Show>
        </ItemActions>
      </ItemMain>
    </ItemWrapper>
  );
}

function Show({ when, children }) {
  return when ? children : null;
}

function ArchiveClassCategory({ classCategory, onSuccessArchive }) {
  const { submit, isLoading, isError, errors, isSuccess } = useSubmitArchiveAgeCategory(
    classCategory.id
  );
  return (
    <React.Fragment>
      <ConfirmPrompt
        renderButton={({ handlePrompt }) => (
          <ButtonGhostBlue flexible onClick={handlePrompt}>
            <IconTrash size="16" />
          </ButtonGhostBlue>
        )}
        messagePrompt={`Kelas "${classCategory.label}" akan dihapus`}
        messageDescription="Yakin akan menghapus kelas?"
        buttonConfirmLabel="Yakin"
        onConfirm={submit}
      />

      <LoadingScreen loading={isLoading} />
      <AlertSubmitError isError={isError} errors={errors} />
      <AlertSuccess
        isSuccess={isSuccess}
        prompt="Berhasil menghapus kelas"
        onConfirm={onSuccessArchive}
      />
    </React.Fragment>
  );
}

function ClassDescription({ classCategory }) {
  const desc = React.useMemo(() => _getClassDescription(classCategory), [classCategory]);
  return <ClassDescriptionWrapper>{desc}</ClassDescriptionWrapper>;
}

/* ==================================== */
// styles

const ItemWrapper = styled.li`
  background-color: #ffffff;
`;

const ItemMain = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;

    > * + * {
      margin-left: 0.25rem;
    }
  }
`;

const ItemBody = styled.div`
  padding: 1rem;

  > * + * {
    margin-top: 1rem;
  }
`;

const ClassLabel = styled.h5`
  margin: 0;
  font-weight: 600;
`;

const ClassDescriptionWrapper = styled.div`
  /*  */
`;

const ItemActions = styled.div`
  padding: 0.75rem;
`;

/* ==================================== */
// utils

function _getClassDescription(classCategory) {
  const parsedData = parseAgeCategoryResponseData(classCategory);

  if (parsedData.criteria === 1) {
    return "Tidak ada batasan usia";
  }

  if (parsedData.criteria === 2 && !parsedData.asDate) {
    const copywritings = {
      min: `Usia lebih dari ${parsedData.min} tahun`,
      max: `Usia kurang dari ${parsedData.max} tahun`,
      range: `Usia ${[parsedData.min, parsedData.max].join(" hingga ")} tahun`,
    };
    return copywritings[parsedData.ageValidator] || "Informasi usia tidak tersedia";
  }

  if (parsedData.criteria === 2 && parsedData.asDate) {
    const copywritings = {
      min: `Kelahiran setelah tanggal ${datetime.formatFullDateLabel(parsedData.min)}`,
      max: `Kelahiran sebelum tanggal ${datetime.formatFullDateLabel(parsedData.max)}`,
      range: `Kelahiran antara tanggal ${[
        datetime.formatFullDateLabel(parsedData.min),
        datetime.formatFullDateLabel(parsedData.max),
      ].join(" hingga ")}`,
    };
    return copywritings[parsedData.ageValidator] || "Informasi tanggal lahir tidak tersedia";
  }

  return null;
}

export { ClassCategoryItem };
