import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";
import { useCategoryDetails } from "./hooks/category-details";
import { useSessionDownload } from "./hooks/download-session";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { SpinnerDotBlock, ButtonOutlineBlue } from "components/ma";
import { toast } from "components/ma/processing-toast";
import { PageWrapper } from "../components/dos-page-wrapper";
import { PageHeader } from "../components/page-header";
import {
  ToolbarFilter,
  KnobGroupLayout,
  KnobsClassCategories,
  KnobsTeamCategories,
  Knobs,
} from "../components/toolbar-filters";
import { ScoringTable } from "./components/scoring-table";
import { ScoringTeamTable } from "./components/scoring-table/reguTable";

import IconDownload from "components/ma/icons/mono/download";
import { useQualificationDownload } from "pages/dashboard/events/scoring-qualification/hooks/qualification-download";

const pageProps = {
  pageTitle: "Kualifikasi",
};

function PageDosQualification() {
  const { event_id, date_event } = useParams();
  const eventId = parseInt(event_id);
  const { data: eventDetail } = useEventDetail(eventId);

  const {
    data: categoryDetails,
    errors: errorsCategoryDetail,
    isSettled: isSettledCategories,
    isLoading: isLoadingCategories,
  } = useCategoryDetails(eventId, date_event);

  const [activeCategory, setActiveCategory] = React.useState(null);
  const [inputSearchQuery, setInputSearchQuery] = React.useState("");
  const [session, setSession] = React.useState(0);
  const { handleDownloadSession } = useSessionDownload(activeCategory?.id);
  const { download: downloadQualification } = useQualificationDownload(eventId, activeCategory?.id);

  // TODO:
  const resetOnChangeCategory = () => {
    setInputSearchQuery("");
  };

  const isIndividual = activeCategory?.categoryTeam?.toLowerCase?.() !== "team";
  const sessionCount = activeCategory?.sessionInQualification;
  const optionsSession = _makeOptionsSessionFromCount(sessionCount);

  const errorFetchingInitialCategories = !categoryDetails && errorsCategoryDetail;

  if (errorFetchingInitialCategories) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading="Kualifikasi" />
        <CardWrapper>
          <Content>
            <p>
              Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
              teknis lebih lanjut:
            </p>

            <pre>{JSON.stringify(errorsCategoryDetail)}</pre>
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  if (!isSettledCategories) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading="Kualifikasi" />
        <CardWrapper>
          <Content>
            <SpinnerDotBlock />
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper {...pageProps}>
      <PageHeader eventDetail={eventDetail} subHeading="Kualifikasi" />

      <CardWrapper>
        <ToolbarFilter
          categories={categoryDetails}
          isLoading={isLoadingCategories}
          onChange={(value) => setActiveCategory(value?.categoryDetail)}
          viewLeft={
            <KnobGroupLayout>
              <KnobsClassCategories />
              <KnobsTeamCategories />
              {isIndividual && (
                <Knobs
                  label="Sesi"
                  options={optionsSession}
                  activeKnobId={session}
                  onChange={(value) => setSession(value)}
                />
              )}
            </KnobGroupLayout>
          }
          viewRight={
            <ToolbarViewRight
              isIndividual={isIndividual}
              sessionOptions={optionsSession}
              onDownload={(session) => {
                toast.loading("Sedang menyiapkan dokumen kualifikasi DOS...");
                if (session === 'qualification') {
                  downloadQualification({
                    onSuccess: () => {
                      toast.dismiss();
                    },
                    onError: () => {
                      toast.dismiss();
                      toast.error("Gagal memulai unduhan");
                    },
                  });
                } else {
                  handleDownloadSession(session, {
                    onSuccess() {
                      toast.dismiss();
                      toast.success("Unduhan dimulai");
                    },
                    onError() {
                      toast.dismiss();
                      toast.success("Gagal memulai unduhan");
                    },
                  });
                }
              }}
            />
          }
        />
        <Content>
          {!activeCategory ? (
            <NoBracketWrapper>
              <h4>Data kategori tidak tersedia</h4>
            </NoBracketWrapper>
          ) : isIndividual ? (
            <ScoringTable
              key={activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              searchName={inputSearchQuery}
              onChangeParticipantPresence={resetOnChangeCategory}
              eliminationParticipantsCount={activeCategory?.defaultEliminationCount}
              isTeam={!isIndividual}
              session={session}
              eventDetail={eventDetail}
            />
          ) : (
            <ScoringTeamTable
              key={activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              searchName={inputSearchQuery}
              onChangeParticipantPresence={resetOnChangeCategory}
              eliminationParticipantsCount={activeCategory?.defaultEliminationCount}
              isTeam={!isIndividual}
              eventDetail={eventDetail}
            />
          )}
        </Content>
      </CardWrapper>
    </PageWrapper>
  );
}

function ToolbarViewRight({ isIndividual, sessionOptions, session, onDownload }) {
  if (isIndividual) {
    return (
      <HorizontalSpaced>
        <MenuSession options={sessionOptions} session={session} onDownload={onDownload} />
      </HorizontalSpaced>
    );
  }

  const [isOpen, setOpen] = React.useState(false);

  return (
    <HorizontalSpaced>
      <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
        <DropdownToggle tag="span">
          <ButtonOutlineBlue>
            <span>
              <IconDownload size="16" />
            </span>{" "}
            <span>Cetak Peringkat</span>
          </ButtonOutlineBlue>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="button" onClick={() => onDownload?.()}>
            <span>Laporan Sesi</span>
          </DropdownItem>
          <DropdownItem tag="button" onClick={() => onDownload('qualification')}>
            <span>Pemeringkatan</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </HorizontalSpaced>
  );
}

function MenuSession({ options, onDownload }) {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
      <DropdownToggle tag="span">
        <ButtonOutlineBlue>
          <span>
            <IconDownload size="16" />
          </span>{" "}
          <span>Cetak Peringkat</span>
        </ButtonOutlineBlue>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        {options.map((option) => (
          <DropdownItem key={option.value} tag="button" onClick={() => onDownload(option.value)}>
            <span>Laporan {option.label}</span>
          </DropdownItem>
        ))}
        <DropdownItem tag="button" onClick={() => onDownload('qualification')}>
          <span>Pemeringkatan</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

/* =============================== */
// styles

const CardWrapper = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const NoBracketWrapper = styled.div`
  min-height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;

  > *:nth-child(1) {
    margin-top: -2rem;
    color: var(--ma-gray-400);
  }
`;

const HorizontalSpaced = styled.div`
  > * + * {
    margin-left: 0.5rem;
  }
`;

const Content = styled.div`
  padding: 0.5rem 1.875rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

/* =============================== */
// utils

function _makeOptionsSessionFromCount(sessionCount) {
  const sessionNumbers = _makeSessionNumbers(sessionCount);
  return sessionNumbers.map((number) => ({
    value: number,
    label: number > 0 ? "Sesi " + number : "Sesi Total",
  }));
}

function _makeSessionNumbers(sessionCount) {
  const defaultSessionId = 0;
  if (!sessionCount) {
    return [defaultSessionId];
  }
  const qualificationSessions = [...new Array(sessionCount)].map((item, index) => index + 1);
  return [defaultSessionId, ...qualificationSessions];
}

export default PageDosQualification;
