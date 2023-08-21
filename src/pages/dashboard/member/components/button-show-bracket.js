import * as React from "react";
import styled from "styled-components";
import { useEliminationBracketTemplate } from "../hooks/elimination-template";

import { Modal, ModalBody } from "reactstrap";
import {
  Bracket,
  Seed as RBSeed,
  SeedItem as RBSeedItem,
  SeedTeam as RBSeedTeam,
} from "react-brackets";
import {
  ButtonOutlineBlue,
  LoadingScreen,
  AlertSubmitError,
} from "components/ma";

import IconBranch from "components/ma/icons/mono/branch";
import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

function ButtonShowBracket({ categoryDetailId, eliminationMemberCount }) {
  const [isOpen, setOpen] = React.useState(false);
  const {
    data: bracketData,
    fetchEliminationTemplate,
    isLoading,
    isError,
    errors,
  } = useEliminationBracketTemplate(categoryDetailId, eliminationMemberCount);

  React.useEffect(() => {
    if (bracketData) {
      let arrData = [];
      let rowTwo = 0;
      let titleLabel = "";
      bracketData.rounds.map((val) => {
        switch (val.seeds.length) {
          case 8:
            titleLabel = "1/8";
            break;
          case 4:
            titleLabel = "1/4";
            break;
          case 2:
            titleLabel = "Semi-Final";
            break;
          case 1:
            if (rowTwo < 1) {
              rowTwo = 1;
              titleLabel = "Final";
            } else {
              titleLabel = "3rd Place";
            }
            break;

          default:
            titleLabel = "1/16";
            break;
        }
        let obj = {
          round: val.round,
          seeds: val.seeds,
          title: (
            <span className="badge bg-primary rounded-pill fs-6">
              {titleLabel}
            </span>
          ),
        };

        return arrData.push(obj);
      });
      bracketData.rounds = arrData;
    }
  }, [bracketData]);

  return (
    <React.Fragment>
      <LoadingScreen loading={isLoading} />
      <AlertSubmitError isError={isError} errors={errors} />

      <ButtonOutlineBlue
        flexible
        title="Lihat Bagan"
        onClick={() => {
          fetchEliminationTemplate({
            onSuccess() {
              setOpen(true);
            },
          });
        }}
      >
        <IconBranch size="20" />
      </ButtonOutlineBlue>

      {isOpen && (
        <Modal
          isOpen
          size="xl"
          centered
          backdrop="static"
          autoFocus
          toggle={() => setOpen((open) => !open)}
          onClosed={() => setOpen(false)}
        >
          <ModalBody>
            <BodyWrapper>
              <TopBar>
                <EditorCloseButton flexible onClick={() => setOpen(false)}>
                  <IconX size="16" />
                </EditorCloseButton>
              </TopBar>

              <div>
                <Scrollable>
                  <Bracket
                    rounds={bracketData.rounds || []}
                    renderSeedComponent={(bracketProps) => (
                      <SeedBagan
                        bracketProps={bracketProps}
                        configs={{
                          totalRounds: bracketData.rounds.length - 1,
                          eliminationId: bracketData.eliminationId,
                        }}
                      />
                    )}
                  />
                </Scrollable>
              </div>
            </BodyWrapper>
          </ModalBody>
        </Modal>
      )}
    </React.Fragment>
  );
}

function SeedBagan({ bracketProps, configs }) {
  const { roundIndex, seed, breakpoint } = bracketProps;

  const isFinalRound =
    (configs.totalRounds === 4 && roundIndex === 3) ||
    (configs.totalRounds === 3 && roundIndex === 2);
  const isThirdPlaceRound =
    (configs.totalRounds === 4 && roundIndex === 4) ||
    (configs.totalRounds === 3 && roundIndex === 3);

  return (
    <Seed
      mobileBreakpoint={breakpoint}
      className={classnames({
        "round-final": isFinalRound,
        "round-third-place": isThirdPlaceRound,
      })}
    >
      <SeedItem>
        <ItemContainer>
          {isFinalRound && <FinalHeading>Medali Emas</FinalHeading>}
          {isThirdPlaceRound && <FinalHeading>Medali Perunggu</FinalHeading>}
          {seed.teams.map((team, index) => (
            <SeedTeam key={index}>
              <BoxName>
                {team.name || <React.Fragment>&ndash;</React.Fragment>}
              </BoxName>
            </SeedTeam>
          ))}
        </ItemContainer>
      </SeedItem>
    </Seed>
  );
}

/* ================================== */
// styles

const BodyWrapper = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Scrollable = styled.div`
  overflow-x: auto;
`;

const EditorCloseButton = styled.button`
  padding: 0.375rem 0.625rem;
  border: none;
  background-color: transparent;
  color: var(--ma-blue);

  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-200);
  }
`;

const FinalHeading = styled.h6`
  position: absolute;
  top: -3.6em;
  left: 0;
  right: 0;
  font-weight: 600;
  text-align: center;
`;

const Seed = styled(RBSeed)`
  padding-top: 2rem;
  padding-bottom: 2rem;

  &.round-third-place {
    margin-left: 3.75rem;
  }
`;

const SeedItem = styled(RBSeedItem)`
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.05);
  background-color: var(--ma-primary-blue-50);
`;

const SeedTeam = styled(RBSeedTeam)`
  gap: 0.25rem;
  padding: 0.5rem;
  border: solid 2px #757575;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: var(--bs-body-color);
  font-size: var(--bs-body-font-size);

  &.item-active {
    border-color: #0d47a1;
  }

  &.item-winner {
    border-color: var(--ma-blue);
    background-color: #bc8b2c;
    color: #000000;
  }
`;

const ItemContainer = styled.div`
  position: relative;

  > ${SeedTeam} + ${SeedTeam} {
    border-top: none;
  }
`;

const BoxName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export { ButtonShowBracket };
