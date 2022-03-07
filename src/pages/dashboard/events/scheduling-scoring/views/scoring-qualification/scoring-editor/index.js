import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";
import { ButtonOutlineBlue } from "components/ma";
import { EditorContent } from "./editor-content";

import IconEdit from "components/ma/icons/mono/edit";

function ScoringEditor(forwardedProps) {
  const [shouldOpen, setOpen] = React.useState(false);
  const toggleControl = () => setOpen((open) => !open);
  const openControl = () => setOpen(true);
  const closeControl = () => setOpen(false);

  return (
    <React.Fragment>
      <EditorButton onClick={openControl} disabled={forwardedProps.disabled}>
        <IconEdit size="18" />
      </EditorButton>

      {shouldOpen && (
        <EditorControl {...{ toggleControl, openControl, closeControl }}>
          <EditorContent onClose={closeControl} {...forwardedProps} />
        </EditorControl>
      )}
    </React.Fragment>
  );
}

function EditorControl({ children, openControl, closeControl }) {
  return (
    <StyledModal isOpen={true} size="lg" onOpened={openControl} onClosed={closeControl}>
      <ModalBody>{children}</ModalBody>
    </StyledModal>
  );
}

const EditorButton = styled(ButtonOutlineBlue)`
  &,
  &:focus,
  &:active {
    padding: 0.25rem 0.45rem;
    border-color: transparent;
  }

  &:hover {
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
    color: var(--ma-blue);
  }

  &:focus {
    box-shadow: 0 0 0 1px rgb(38, 132, 255);
  }

  &:disabled {
    border-color: transparent;
    background-color: transparent;

    &:hover {
      color: var(--ma-gray-200);
    }
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 0.5rem;
  }
`;

export { ScoringEditor };
