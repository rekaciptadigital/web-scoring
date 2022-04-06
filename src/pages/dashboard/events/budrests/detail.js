import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useRouteQueryParams } from "./hooks/route-params";
import { useMemberBudrests } from "./hooks/member-budrests";
import { useSearchMemberBudrests } from "./hooks/search-member-budrest";

import { ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { SubNavbar } from "../components/submenus-settings";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";

import { datetime } from "utils";

function PageEventBudRestDetail() {
  const { eventId, date: dateFromParam } = useRouteQueryParams();

  const { data: memberBudrests, isLoading: isLoadingMemberBudrests } = useMemberBudrests(
    eventId,
    dateFromParam
  );

  const {
    searchKeyword,
    setSearchKeyword,
    searchResults: searchResultsByName,
  } = useSearchMemberBudrests(memberBudrests);

  // Fallback ke data awal kalau belum ada search karena datanya
  // masih `null` meskipun loading API sudah selesai, bisa crash.
  const memberBudrestsData = searchResultsByName || memberBudrests;

  if (!dateFromParam) {
    return (
      <ContentLayoutWrapper
        pageTitle="Pengaturan Bantalan"
        navbar={<SubNavbar eventId={eventId} />}
      >
        <CardSheet>
          <VerticalSpacedBox>
            <div>
              Tanggal bertanding tidak valid. Silakan terapkan pengaturan bantalan lebih dulu.
            </div>
            <div>
              <ButtonOutlineBlue as={Link} to={`/dashboard/event/${eventId}/budrests`}>
                Ke pengaturan bantalan
              </ButtonOutlineBlue>
            </div>
          </VerticalSpacedBox>
        </CardSheet>
      </ContentLayoutWrapper>
    );
  }

  if (!memberBudrests && isLoadingMemberBudrests) {
    return (
      <ContentLayoutWrapper
        pageTitle="Pengaturan Bantalan"
        navbar={<SubNavbar eventId={eventId} />}
      >
        <CardSheet>Sedang menyiapkan data nomor bantalan...</CardSheet>
      </ContentLayoutWrapper>
    );
  }

  if (!memberBudrests) {
    return (
      <ContentLayoutWrapper
        pageTitle="Pengaturan Bantalan"
        navbar={<SubNavbar eventId={eventId} />}
      >
        <CardSheet>
          <VerticalSpacedBox>
            <div>Data tidak tersedia.</div>
            <div>
              <ButtonOutlineBlue as={Link} to={`/dashboard/event/${eventId}/budrests`}>
                Ke pengaturan bantalan
              </ButtonOutlineBlue>
            </div>
          </VerticalSpacedBox>
        </CardSheet>
      </ContentLayoutWrapper>
    );
  }

  const dateLabel = datetime.formatFullDateLabel(memberBudrests.date);

  return (
    <ContentLayoutWrapper pageTitle="Pengaturan Bantalan" navbar={<SubNavbar eventId={eventId} />}>
      <CardSheet>
        <VerticalSpacedBox>
          <SpacedHeader>
            <div>
              <h5>Data Peserta</h5>
              <h6 className="fw-bold">{dateLabel}</h6>
            </div>

            <div>
              <ButtonBlue as={Link} to={`/dashboard/event/${eventId}/budrests`}>
                Selesai
              </ButtonBlue>
            </div>
          </SpacedHeader>

          <input
            type="text"
            placeholder="Cari peserta"
            value={searchKeyword}
            onChange={(ev) => setSearchKeyword(ev.target.value)}
          />

          <VerticalSpacedBoxLoose>
            {memberBudrestsData.groups.length ? (
              memberBudrestsData.groups.map((group) => (
                <div key={group.id}>
                  <CategoryLabelHead>
                    {group.label} (id: {group.id})
                  </CategoryLabelHead>

                  <table className="table table-responsive">
                    <thead>
                      <tr>
                        <th colSpan="2">Bantalan</th>
                        <th>Nama</th>
                        <th>Klub</th>
                      </tr>
                    </thead>

                    <tbody>
                      {memberBudrestsData.budrestsByCategory[group.id].map((memberBudrest) => (
                        <React.Fragment key={memberBudrest.budRestNumber}>
                          <tr>
                            {/* <ColSpanningRow rowSpan={3}> */}
                            <ColSpanningRow>
                              <span>{memberBudrest.budRestNumber}</span>
                            </ColSpanningRow>

                            <td>{memberBudrest.budRestNumber}</td>
                            <td>{memberBudrest.name}</td>
                            <td>{memberBudrest.clubName}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div>
                Data tidak ditemukan.
                <br />
                TODO: styling
              </div>
            )}
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

const CategoryLabelHead = styled.div`
  padding: 1rem;
  background-color: var(--ma-primary-blue-50);
  font-weight: 600;
`;

const ColSpanningRow = styled.td`
  text-align: center;
  vertical-align: middle;
`;

export default PageEventBudRestDetail;
