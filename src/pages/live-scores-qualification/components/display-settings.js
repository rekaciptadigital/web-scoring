import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";
import { ButtonBlue } from "components/ma";
import { SelectCategories } from "./select-multi-categories";
import { SelectSession } from "./select-session";

import IconSettings from "components/ma/icons/mono/settings";

function DisplaySettings({ sessionNumber, categories, onChangeSession }) {
  const [isOpen, setOpen] = React.useState(true);
  return (
    <React.Fragment>
      <div>
        <ButtonSetting onClick={() => setOpen((open) => !open)} />
      </div>
      {isOpen && (
        <Modal
          isOpen
          size="md"
          autoFocus
          centered
          tabIndex="-1"
          toggle={() => setOpen((open) => !open)}
          unmountOnClose
        >
          <ModalBody>
            <div>
              <h2>Pengaturan Live Score</h2>

              <p>Copywriting instruksi...</p>

              <VerticalSpaced>
                <div>
                  <SelectCategories value={categories} />
                </div>
                <div>
                  <SelectSession value={sessionNumber} onChange={onChangeSession} />
                </div>
                <BottomAction>
                  <ButtonBlue onClick={() => setOpen((open) => !open)}>Tutup</ButtonBlue>
                </BottomAction>
              </VerticalSpaced>
            </div>
          </ModalBody>
        </Modal>
      )}
    </React.Fragment>
  );
}

function ButtonSetting({ onClick }) {
  return (
    <ButtonSettingStyled onClick={onClick}>
      <IconSettings size="20" />
    </ButtonSettingStyled>
  );
}

const ButtonSettingStyled = styled.button`
  border: none;
  display: inline-block;
  padding: 0.25rem 0.75rem;
  min-height: 2.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background-color: var(--ma-gray-200);
  color: var(--ma-gray-500);

  transition: all 0.15s ease-in;

  &:hover {
    background-color: var(--ma-gray-100);
    color: var(--ma-blue);
  }
`;

const VerticalSpaced = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const BottomAction = styled.div`
  text-align: center;
`;

export { DisplaySettings };
