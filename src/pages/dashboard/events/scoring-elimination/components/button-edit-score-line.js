import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";

import {
  ButtonOutlineBlue,
} from "components/ma";

import IconEdit from "components/ma/icons/mono/edit";
import IconX from "components/ma/icons/mono/x";

function ButtonEditScoreLine({ disabled }) {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <ButtonOutlineBlue flexible onClick={() => setOpen(true)} disabled={disabled}>
        <span>Edit</span>{" "}
        <span>
          <IconEdit size="16" />
        </span>
      </ButtonOutlineBlue>

      {isOpen && (
        <Modal
          isOpen
          size="xl"
          centered
          backdrop="static"
          autoFocus
          toggle={() => setOpen((open) => !open)}
          onClosed={() => setOpen(false)}
        >
          <ModalBody>
            <BodyWrapper>
              <TopBar>
                <h4>Scoresheet</h4>
                <EditorCloseButton flexible onClick={() => setOpen(false)}>
                  <IconX size="16" />
                </EditorCloseButton>
              </TopBar>

              <div>score editor</div>
            </BodyWrapper>
          </ModalBody>
        </Modal>
      )}
    </React.Fragment>
  );
}

/* ================================== */
// styles

const BodyWrapper = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const EditorCloseButton = styled.button`
  padding: 0.375rem 0.625rem;
  border: none;
  background-color: transparent;
  color: var(--ma-blue);

  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-200);
  }
`;

export { ButtonEditScoreLine };
