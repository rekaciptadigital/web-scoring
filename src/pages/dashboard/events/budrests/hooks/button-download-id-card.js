import * as React from "react";
import styled from "styled-components";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { ButtonOutlineBlue } from "components/ma";

import IconDownload from "components/ma/icons/mono/download";

function ButtonDownloadIdCard({
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
        <span></span> <span>{buttonLabel}</span>
      </ButtonOutlineBlue>
    );
  }

  console.log(sessionNumbers);

  return (
    <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
      <DropdownToggle tag="div">
        <ButtonOutlineBlue block>
          <span></span> <span>{buttonLabel}</span>
        </ButtonOutlineBlue>
      </DropdownToggle>

      <DropdownMenu>
        <DropdownItem header>Jenis Berkas</DropdownItem>
        {!sessionNumbers?.length ? (
          <DropdownItem>
            <ItemActionWrapper>
              <span>Tidak tersedia</span>
              <span></span>
            </ItemActionWrapper>
          </DropdownItem>
        ) : (
          // sessionNumbers.map((sessionNumber) => (
          //   <DropdownItem key={sessionNumber} onClick={() => onDownload?.(sessionNumber)}>
          //     <ItemActionWrapper>
          //       <span>Scoresheet Sesi {sessionNumber}</span>
          //       <span>
          //         <IconDownload size="16" />
          //       </span>
          //     </ItemActionWrapper>
          //   </DropdownItem>
          // ))
          <div>
            <DropdownItem key={1} onClick={() => onDownload?.(sessionNumber)}>
              <ItemActionWrapper>
                <span>Unduh Berdasarkan Klub</span>
                <span>
                  <IconDownload size="16" />
                </span>
              </ItemActionWrapper>
            </DropdownItem>
            <DropdownItem key={2} onClick={() => onDownload?.(sessionNumber)}>
              <ItemActionWrapper>
                <span>Unduh Berdasarkan Kategori</span>
                <span>
                  <IconDownload size="16" />
                </span>
              </ItemActionWrapper>
            </DropdownItem>
            <DropdownItem key={3} onClick={() => onDownload?.(sessionNumber)}>
              <ItemActionWrapper>
                <span>Unduh Berdasarkan Urutan No. Bantalan</span>
                <span>
                  <IconDownload size="16" />
                </span>
              </ItemActionWrapper>
            </DropdownItem>
          </div>
        )}
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

export { ButtonDownloadIdCard };
