import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";
import { ButtonBlue } from "components/ma";
import { EditorContent } from "./editor-content";

function ScoringEditor(props) {
  const [isEditorOpen, setEditorOpen] = React.useState(false);

  return (
    <div>
      <ButtonScoring onClick={() => setEditorOpen(true)}>scoring</ButtonScoring>

      {isEditorOpen && (
        <EditorControl onClosed={() => setEditorOpen(false)}>
          <EditorContent {...props} onClose={() => setEditorOpen(false)} />
        </EditorControl>
      )}
    </div>
  );
}

function EditorControl({ children, ...props }) {
  return (
    <StyledModal isOpen size="xl" centered {...props}>
      <ModalBody>{children}</ModalBody>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 0.5rem;
  }
`;

const ButtonScoring = styled(ButtonBlue)`
  &,
  &:focus,
  &:active {
    padding: 2px 8px;
    font-size: 0.875em;
  }
`;

export { ScoringEditor };
