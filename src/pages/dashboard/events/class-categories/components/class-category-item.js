import * as React from "react";
import styled from "styled-components";

import { ButtonGhostBlue } from "components/ma";
import { EditClassCategory } from "./editor-class-category";
import { ConfirmPrompt } from "./confirm-prompt";

import IconEye from "components/ma/icons/mono/eye";
import IconEdit from "components/ma/icons/mono/edit";
import IconTrash from "components/ma/icons/mono/trash";

function ClassCategoryItem({ classCategory, onSuccessSubmit }) {
  return (
    <ItemWrapper>
      <ItemMain>
        <ItemBody>
          <ClassLabel>{classCategory.label}</ClassLabel>
          <ClassDescription>{classCategory.description}</ClassDescription>
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
            <ButtonGhostBlue flexible>
              <IconEye size="16" />
            </ButtonGhostBlue>
          )}

          <Show when={classCategory.eoId && classCategory.canUpdate}>
            <ConfirmPrompt
              renderButton={({ handlePrompt }) => (
                <ButtonGhostBlue flexible onClick={handlePrompt}>
                  <IconTrash size="16" />
                </ButtonGhostBlue>
              )}
              reverseButtons
              messagePrompt={`Yakin akan menghapus kelas "${classCategory.label}"?`}
              messageDescription=""
              buttonConfirmLabel="Yakin"
              onConfirm={() => alert(`Pura-puranya hapus kelas "${classCategory.label}"`)}
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

/* ==================================== */
// utils

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

const ClassDescription = styled.div`
  /*  */
`;

const ItemActions = styled.div`
  padding: 0.75rem;
`;

export { ClassCategoryItem };
