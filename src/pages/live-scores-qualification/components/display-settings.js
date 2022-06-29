import * as React from "react";
import styled from "styled-components";
import { useDisplaySettings } from "../contexts/display-settings";

import { Modal, ModalBody } from "reactstrap";
import { SpinnerDotBlock, ButtonBlue } from "components/ma";
import { SelectCategories } from "./select-multi-categories";
import { SelectSession } from "./select-session";

import IconSettings from "components/ma/icons/mono/settings";

function DisplaySettings() {
  const [isOpen, setOpen] = React.useState(true);
  const { isLoading } = useDisplaySettings();
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
            <VerticalSpaced>
              <div>
                <h2>Pengaturan Live Score</h2>
                <p>Pengaturan Live Score yang Ditampilkan untuk Streaming pada Layar Televisi.</p>
              </div>

              {isLoading ? (
                <div>
                  <SpinnerDotBlock />
                </div>
              ) : (
                <React.Fragment>
                  <div>
                    <label>Kategori</label>
                    <SelectCategories />
                    <BottomInstruction>
                      Anda dapat memilih lebih dari satu kategori untuk ditampilkan di TV secara
                      bergantian.
                    </BottomInstruction>
                  </div>

                  <div>
                    <label>Sesi</label>
                    <SelectSession />
                  </div>

                  <BottomAction>
                    <ButtonBlue onClick={() => setOpen((open) => !open)}>Tutup</ButtonBlue>
                  </BottomAction>
                </React.Fragment>
              )}
            </VerticalSpaced>
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

  &,
  & > * {
    transition: all 0.15s ease-in, transform 0.35s ease-in-out;
  }

  &:hover {
    background-color: var(--ma-gray-100);
    color: var(--ma-blue);

    > * {
      transform: rotateZ(180deg);
    }
  }
`;

const VerticalSpaced = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const BottomInstruction = styled.p`
  margin: 0.5rem 0;
  color: var(--ma-gray-500);
  font-size: 0.75rem;
`;

const BottomAction = styled.div`
  text-align: center;
`;

export { DisplaySettings };
