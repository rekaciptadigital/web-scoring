import * as React from "react";
import styled from "styled-components";
import { useParams, useHistory, Link } from "react-router-dom";

import { NoticeBarInfo, ButtonOutlineBlue, ButtonGhostBlue } from "components/ma";
import { SubNavbar } from "../components/submenus-settings";
import { FieldInputDateSmall, FieldInputTextSmall } from "../components/form-fields";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { DisplayTextSmall } from "./components/display-text-small";

function PageEventBudRests() {
  const { event_id } = useParams();
  const history = useHistory();
  const eventId = parseInt(event_id);

  return (
    <ContentLayoutWrapper pageTitle="Pengaturan Bantalan" navbar={<SubNavbar eventId={eventId} />}>
      <CardSheet>
        <VerticalSpacedBox>
          <NoticeBarInfo>Pengaturan aktif apabila pendaftaran lomba telah ditutup</NoticeBarInfo>

          <VerticalSpacedBoxLoose>
            {[1, 2, 3].map((id) => (
              <DayGroup key={id}>
                <VerticalSpacedBox>
                  <SpacedHeader>
                    <SpacedHeaderLeft>
                      <FieldInputDateSmall label="Tanggal" disabled value={null} />
                    </SpacedHeaderLeft>

                    <HorizontalSpacedButtonGroups>
                      {id === 2 && (
                        <ButtonGhostBlue as={Link} to={getDetailUrl(eventId)}>
                          Ubah Bantalan Peserta
                        </ButtonGhostBlue>
                      )}
                      <ButtonOutlineBlue
                        disabled={id === 2}
                        onClick={() => {
                          const detailUrl = getDetailUrl(eventId);
                          history.push(detailUrl);
                        }}
                      >
                        Terapkan
                      </ButtonOutlineBlue>
                    </HorizontalSpacedButtonGroups>
                  </SpacedHeader>

                  <DetailList>
                    <VerticalSpacedBox>
                      {(id === 2 ? [1, 2, 3, 4] : [1, 2]).map((id) => (
                        <DetailItem key={id}>
                          <DetailInput>
                            <div title={"Tooltip untuk kategori yang tampil"}>
                              <DisplayTextSmall label="Kategori" disabled value="Suatu kategori" />
                            </div>

                            <BudrestInputGroup>
                              <FieldInputTextSmall placeholder="0">
                                Awal Bantalan
                              </FieldInputTextSmall>

                              <FieldInputTextSmall placeholder="0">
                                Akhir Bantalan
                              </FieldInputTextSmall>

                              <FieldInputTextSmall placeholder="0">Target Face</FieldInputTextSmall>

                              <DisplayTextSmall noBorder>Total Peserta</DisplayTextSmall>
                            </BudrestInputGroup>
                          </DetailInput>
                        </DetailItem>
                      ))}
                    </VerticalSpacedBox>
                  </DetailList>
                </VerticalSpacedBox>
              </DayGroup>
            ))}
          </VerticalSpacedBoxLoose>
        </VerticalSpacedBox>
      </CardSheet>
    </ContentLayoutWrapper>
  );
}

const CardSheet = styled.div`
  position: relative;
  margin-bottom: 24px;

  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const VerticalSpacedBox = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const VerticalSpacedBoxLoose = styled.div`
  > * + * {
    margin-top: 3rem;
  }
`;

const DayGroup = styled.div`
  padding: 1rem;
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;
`;

const SpacedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const SpacedHeaderLeft = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    max-width: 10rem;
    flex: 1;
  }
`;

const HorizontalSpacedButtonGroups = styled.div`
  > * + * {
    margin-left: 0.5rem;
  }
`;

const DetailList = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid var(--ma-gray-100);
  border-radius: 0.25rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const DetailInput = styled.div`
  display: flex;
  gap: 1rem;

  > *:nth-child(1) {
    max-width: 20rem;
    flex: 1;
  }

  > *:nth-child(2) {
    width: 0;
    flex: 1;
  }
`;

const BudrestInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > * {
    max-width: 6.375rem;
    flex: 1;
  }
`;

/* ===================================== */
// utils

function getDetailUrl(eventId) {
  if (!eventId) {
    return "#";
  }
  return `/dashboard/event/${eventId}/budrests/detail`;
}

export default PageEventBudRests;
