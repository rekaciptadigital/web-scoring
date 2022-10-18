import * as React from "react";
import styled from "styled-components";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { ButtonOutlineBlue } from "components/ma";

import IconDownload from "components/ma/icons/mono/download";

function ButtonDownloadScoresheet({
  buttonLabel = "Unduh Dokumen",
  disabled,
  sessionCount,
  onDownload,
}) {
  const [isOpen, setOpen] = React.useState(false);

  const sessionNumbers = React.useMemo(() => {
    if (!sessionCount) {
      return [];
    }
    return [...new Array(sessionCount)].map((item, index) => index + 1);
  }, [sessionCount]);

  if (disabled) {
    return (
      <ButtonOutlineBlue
        disabled
        title="Scoresheet kualifikasi hanya tersedia untuk kualifikasi individu"
      >
        <span>
          <IconDownload size="16" />
        </span>{" "}
        <span>{buttonLabel}</span>
      </ButtonOutlineBlue>
    );
  }

  return (
    <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
      <DropdownToggle tag="div">
        <ButtonOutlineBlue block>
          <span>
            <IconDownload size="16" />
          </span>{" "}
          <span>{buttonLabel}</span>
        </ButtonOutlineBlue>
      </DropdownToggle>

      <DropdownMenu>
        <DropdownItem header>Jenis Berkas</DropdownItem>
        {!sessionNumbers?.length ? (
          <DropdownItem>
            <ItemActionWrapper>
              <span>Tidak tersedia sesi</span>
              <span></span>
            </ItemActionWrapper>
          </DropdownItem>
        ) : (
          sessionNumbers.map((sessionNumber) => (
            <DropdownItem key={sessionNumber} onClick={() => onDownload?.(sessionNumber)}>
              <ItemActionWrapper>
                <span>Scoresheet Sesi {sessionNumber}</span>
                <span>
                  <IconDownload size="16" />
                </span>
              </ItemActionWrapper>
            </DropdownItem>
          ))
        )}
        <DropdownItem onClick={() => onDownload?.('qualification')}>
          <ItemActionWrapper>
            <span>Pemeringkatan</span>
            <span>
              <IconDownload size="16" />
            </span>
          </ItemActionWrapper>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

const ItemActionWrapper = styled.div`
  min-width: 10rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }
  > *:nth-child(2) {
    flex-shrink: 0;
    color: var(--ma-blue);
  }
`;

export { ButtonDownloadScoresheet };
