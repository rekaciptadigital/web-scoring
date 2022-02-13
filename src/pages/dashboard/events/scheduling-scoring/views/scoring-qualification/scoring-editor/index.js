import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";
import { ButtonOutlineBlue } from "components/ma";
import { EditorContent } from "./editor-content";

import IconEdit from "components/ma/icons/mono/edit";

function ScoringEditor({ id, data }) {
  const [shouldOpen, setOpen] = React.useState(false);
  const toggleControl = () => setOpen((open) => !open);
  const openControl = () => setOpen(true);
  const closeControl = () => setOpen(false);

  return (
    <React.Fragment>
      <EditorButton onClick={openControl}>
        <IconEdit size="18" />
      </EditorButton>

      {shouldOpen && (
        <EditorControl {...{ toggleControl, openControl, closeControl }}>
          <EditorContent id={id} data={data} onClose={closeControl} />
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
  &:focus {
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
`;

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 0.5rem;
  }
`;

export { ScoringEditor };
