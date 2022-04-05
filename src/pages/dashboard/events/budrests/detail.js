import * as React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";

import { ButtonBlue } from "components/ma";
import { SubNavbar } from "../components/submenus-settings";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";

function PageEventBudRestDetail() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  return (
    <ContentLayoutWrapper pageTitle="Pengaturan Bantalan" navbar={<SubNavbar eventId={eventId} />}>
      <CardSheet>
        <VerticalSpacedBox>
          <SpacedHeader>
            <div>
              <h5>Data Peserta</h5>
              <h6 className="fw-bold">2 Juni 2022</h6>
            </div>

            <div>
              <ButtonBlue as={Link} to={`/dashboard/event/${eventId}/budrests`}>
                Selesai
              </ButtonBlue>
            </div>
          </SpacedHeader>

          <VerticalSpacedBoxLoose>
            {[1, 2].map((id) => (
              <div key={id}>
                <CategoryLabelHead>Nasional - Umum - 30m - Individu Putra</CategoryLabelHead>

                <table className="table table-responsive">
                  <thead>
                    <tr>
                      <th colSpan="2">Bantalan</th>
                      <th>Nama</th>
                      <th>Klub</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[1, 2].map((id) => (
                      <React.Fragment key={id}>
                        <tr>
                          <ColSpanningRow rowSpan={3}>
                            <span>{id}</span>
                          </ColSpanningRow>
                          <td>{id}A</td>
                          <td>Great Lord Fuzon</td>
                          <td>Highest Throne Archery</td>
                        </tr>

                        <tr>
                          <td>{id}B</td>
                          <td>Lord Fuzon</td>
                          <td>Higher Throne Archery</td>
                        </tr>

                        <tr>
                          <td>{id}C</td>
                          <td>Lord Fuzon, Jr.</td>
                          <td>High Throne Archery</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
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
