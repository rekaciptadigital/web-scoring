import * as React from "react";
import styled from "styled-components";
import { useEventDetail } from "../hooks/event-detail";
import { useDisplaySettings } from "../contexts/display-settings";

import { DisplaySettings } from "./display-settings";
import { MenuSessionOptions } from "./menu-session-options";

import IconDot from "components/ma/icons/mono/dot";
import IconLoading from "./icon-loading";

import classnames from "classnames";
import { datetime } from "utils";

import logo from "assets/images/myachery/myachery.png";

function HUD() {
  const { data: eventDetail, isLoading } = useEventDetail();
  const { isRunning, isSessionSet, sessionNumber, lastUpdated, isElimination } =
    useDisplaySettings();
  const textLastUpdated = datetime.formatFullDateLabel(lastUpdated, { withTime: true });

  return (
    <SectionTop>
      <Header>
        <Infos>
          <div>
            <span className="logo-sm">
              <img src={logo} alt="" height="64" />
            </span>
          </div>
          <MainTitleContainer>
            <EventTitle>
              {isLoading ? (
                <SpinningLoader>
                  <IconLoading />
                </SpinningLoader>
              ) : (
                eventDetail?.eventName
              )}
            </EventTitle>
            {isRunning && textLastUpdated ? (
              <div>Kualifikasi | Terakhir diperbarui: {textLastUpdated}</div>
            ) : (
              <div>Kualifikasi</div>
            )}
          </MainTitleContainer>
        </Infos>

        <Settings>
          {isElimination ? (
            <div>
              <LabelLiveScore
                className={classnames({
                  "label-is-live": isRunning,
                  "label-is-elimination": isElimination,
                })}
                disabled={isElimination}
              >
                <LiveScoreIndicator isLive={isRunning} />
                <span>Live Score Eliminasi</span>
              </LabelLiveScore>
            </div>
          ) : (
            <MenuSessionOptions disabled={!isRunning}>
              <LabelLiveScore
                className={classnames({ "label-is-live": isRunning })}
                disabled={!isRunning}
              >
                {isRunning ? (
                  <React.Fragment>
                    <LiveScoreIndicator isLive={isRunning} />
                    {!isSessionSet ? (
                      <span>Pilih Sesi Live Score</span>
                    ) : sessionNumber > 0 ? (
                      <span>Live Score Kualifikasi Sesi {sessionNumber}</span>
                    ) : (
                      <span>Live Score Kualifikasi Semua Sesi</span>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <LiveScoreIndicator />
                    <span>Pilih Kategori Live Score</span>
                  </React.Fragment>
                )}
              </LabelLiveScore>
            </MenuSessionOptions>
          )}

          <DisplaySettings />
        </Settings>
      </Header>
    </SectionTop>
  );
}

function LiveScoreIndicator({ isLive = false }) {
  return (
    <LiveScoreIndicatorWrapper className={classnames({ "indicator-is-live": isLive })}>
      <IconDot size="14" />
    </LiveScoreIndicatorWrapper>
  );
}

/* ========================= */
// styles

const SectionTop = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Infos = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--ma-gray-500);

  > *:nth-child(1) {
    flex-shrink: 0;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const MainTitleContainer = styled.div`
  max-width: 56.25rem;
`;

const EventTitle = styled.h1`
  margin: 0;
  color: var(--ma-blue);
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Settings = styled.div`
  display: flex;
`;

const LabelLiveScore = styled.button`
  border: none;
  display: inline-block;
  min-height: 2.5rem;
  padding: 0.25rem 0.75rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  background-color: var(--ma-gray-200);

  color: var(--ma-gray-500);
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  vertical-align: middle;

  margin-right: 2px;

  > * + * {
    margin-left: 0.5rem;
  }

  &.label-is-live,
  &.label-is-live.label-is-elimination {
    color: var(--ma-blue);
  }

  transition: all 0.15s ease-in;

  &:hover {
    background-color: var(--ma-gray-100);
    color: var(--ma-blue);
  }

  &:disabled {
    background-color: var(--ma-gray-200);
    color: var(--ma-gray-500);
  }
`;

const LiveScoreIndicatorWrapper = styled.span`
  color: var(--ma-gray-400);

  &.indicator-is-live {
    color: var(--ma-text-negative);
  }

  > * {
    transform: translateY(-2px);
  }
`;

const SpinningLoader = styled.span`
  display: inline-block;
  animation: spin-loading 0.7s infinite linear;

  @keyframes spin-loading {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
`;

export { HUD };
