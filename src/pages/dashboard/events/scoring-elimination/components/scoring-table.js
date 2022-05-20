import * as React from "react";
import styled from "styled-components";

import { ButtonBlue } from "components/ma";
import { ButtonEditScoreLine } from "./button-edit-score-line";

import IconAlertCircle from "components/ma/icons/mono/alert-circle";

import imgEmptyBracket from "assets/images/elimination/illustration-empty-bracket.png";

import classnames from "classnames";

function ScoringTable() {
  return (
    <SectionTableContainer>
      <EmptyBracketContainer>
        <FloatingEmptyBracketContent>
          <div>
            <EmptyStateHeading>Bagan belum tersedia</EmptyStateHeading>
            <EmptyStateDescription>
              Maaf tidak ada klasemen dengan kategori yang Anda cari. Silakan cari dengan kategori
              lain.
            </EmptyStateDescription>
          </div>
        </FloatingEmptyBracketContent>
      </EmptyBracketContainer>

      <StagesTabs />

      <MembersTable className="table table-responsive">
        <thead>
          <tr>
            <th>Bantalan</th>
            <th>Nama Peserta</th>
            <th>Total</th>
            <th></th>
            <th>Total</th>
            <th>Nama Peserta</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
            <tr key={id}>
              <td>
                <InputBudrestNumber type="text" value={id + "A"} />
              </td>

              <td>
                <PlayerLabelContainerLeft>
                  <PlayerNameData>
                    <RankLabel>#{id}</RankLabel>
                    <NameLabel>Arief Muhammad</NameLabel>
                  </PlayerNameData>
                </PlayerLabelContainerLeft>
              </td>

              <td>
                <InlineScoreInput>
                  <IndicatorIconWarning>
                    <IconAlertCircle />
                  </IndicatorIconWarning>
                  <InputInlineScore type="text" value="197" />
                </InlineScoreInput>
              </td>

              <td>
                <Head2HeadScoreLabels>
                  <ScoreLabelP1>229</ScoreLabelP1>
                  <span>&ndash;</span>
                  <ScoreLabelP2>312</ScoreLabelP2>
                </Head2HeadScoreLabels>
              </td>

              <td>
                <InlineScoreInput>
                  <InputInlineScore type="text" value="312" />
                  <IndicatorIconValid>
                    {/* TODO: ikon centang tapi circle */}
                    <IconAlertCircle />
                  </IndicatorIconValid>
                </InlineScoreInput>
              </td>

              <td>
                <PlayerLabelContainerRight>
                  <PlayerNameData>
                    <RankLabel>#{17 - id}</RankLabel>
                    <NameLabel>Alshad Ahmad</NameLabel>
                  </PlayerNameData>
                </PlayerLabelContainerRight>
              </td>

              <td>
                <HorizontalSpaced>
                  <ButtonBlue flexible>Terapkan</ButtonBlue>
                  <ButtonEditScoreLine />
                </HorizontalSpaced>
              </td>
            </tr>
          ))}
        </tbody>
      </MembersTable>
    </SectionTableContainer>
  );
}

function StagesTabs() {
  // TODO: yang aktif dibaca dari "tahapan eliminasi" yang sedang berlangsung
  // simulated
  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <StagesBarContainer>
      <StageTabsList>
        {["16 Besar", "8 Besar", "Semi-final", "Final"].map((label, index) => (
          <li key={label}>
            <StageTabButton
              className={classnames({ "session-tab-active": index === selectedTab })}
              onClick={() => setSelectedTab(index)}
            >
              <span>{label}</span>
            </StageTabButton>
          </li>
        ))}
      </StageTabsList>
    </StagesBarContainer>
  );
}

/* ============================ */
// styles

const SectionTableContainer = styled.section`
  background-color: #ffffff;
`;

const InputBudrestNumber = styled.input`
  padding: calc(0.625rem - 1px) calc(0.5rem - 1px);
  width: 3rem;
  border: solid 1px var(--ma-gray-400);
  border-radius: 0.25rem;
  font-weight: 600;
  text-align: center;
`;

const InlineScoreInput = styled.div`
  position: relative;
`;

const InputInlineScore = styled.input`
  padding: calc(0.625rem - 1px) calc(0.5rem - 1px);
  width: 3rem;
  border: solid 1px var(--ma-gray-200);
  border-radius: 0.25rem;
  color: var(--ma-gray-500);
  font-size: 0.85em;
  text-align: center;
`;

const IndicatorIconWarning = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1.75rem;
  display: flex;
  align-items: center;
  color: var(--ma-secondary);
`;

const IndicatorIconValid = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  right: -1.75rem;
  display: flex;
  align-items: center;
  color: green;
`;

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const EmptyBracketContainer = styled.div`
  min-height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FloatingEmptyBracketContent = styled.div`
  max-width: 19.25rem;
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background-image: url("${imgEmptyBracket}");
  background-repeat: no-repeat;
  background-position: top center;

  text-align: center;
`;

const EmptyStateHeading = styled.h4`
  color: var(--ma-blue);
  font-weight: 600;
`;

const EmptyStateDescription = styled.p`
  color: var(--ma-gray-600);
`;

const StagesBarContainer = styled.div`
  /* padding: 1rem 1.875rem; */
  padding: 1rem;
`;

const StageTabsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  gap: 0.5rem;
`;

const StageTabButton = styled.button`
  display: block;
  border: none;
  padding: 0 0.5rem;
  background-color: transparent;

  min-width: 6rem;
  color: var(--ma-gray-400);
  font-size: 0.875rem;
  font-weight: 600;

  transition: all 0.15s;

  > span {
    display: block;
    position: relative;
    width: fit-content;
    margin: 0 auto;
    padding: 0.25rem 0;

    &::before {
      content: " ";
      position: absolute;
      height: 2px;
      top: 0;
      left: 0;
      width: 1.5rem;
      background-color: transparent;
      transition: all 0.3s;
      transform: scaleX(0);
      transform-origin: left;
    }
  }

  &:hover {
    color: var(--ma-blue);
  }

  &.session-tab-active {
    color: var(--ma-blue);

    > span {
      &::before {
        background-color: #90aad4;
        transform: scaleX(1);
      }
    }
  }
`;

const MembersTable = styled.table`
  --indicator-space-margin: 3rem;
  text-align: center;

  thead {
    background-color: var(--ma-primary-blue-50);

    th {
      color: var(--ma-txt-black);
      font-weight: 600;
    }
  }

  tbody td {
    vertical-align: middle;
  }

  th,
  td {
    cursor: auto;
  }
`;

const PlayerLabelContainerLeft = styled.div`
  margin-right: var(--indicator-space-margin);
`;

const PlayerLabelContainerRight = styled.div`
  margin-left: var(--indicator-space-margin);
`;

const PlayerNameData = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const RankLabel = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-primary-blue-50);
  white-space: nowrap;
  font-weight: 600;
`;

const NameLabel = styled.span`
  display: block;
  font-weight: 600;
  text-align: left;
`;

const Head2HeadScoreLabels = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ScoreLabelP1 = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-secondary);
  white-space: nowrap;
`;

const ScoreLabelP2 = styled(ScoreLabelP1)`
  background-color: var(--ma-gray-200);
`;

export { ScoringTable };
