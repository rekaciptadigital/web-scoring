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

import { getClassDescription } from "../utils";

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
  const desc = React.useMemo(() => getClassDescription(classCategory), [classCategory]);
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

export { ClassCategoryItem };
