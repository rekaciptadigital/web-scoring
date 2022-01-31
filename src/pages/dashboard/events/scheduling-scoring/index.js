import * as React from "react";
import { useParams } from "react-router-dom";
import { useWizardView } from "utils/hooks/wizard-view";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { WizardView, WizardViewContent, Button } from "components/ma";
import { StepsList, StepItem, FolderTabs, TabItem, FolderPanel } from "./components";
import { BreadcrumbDashboard } from "../components/breadcrumb";

import IconTarget from "components/ma/icons/mono/target";
import IconScoreboard from "components/ma/icons/mono/scoreboard";
import IconBranch from "components/ma/icons/mono/branch";
import IconDiagram from "components/ma/icons/mono/diagram";
import IconCalendar from "components/ma/icons/mono/calendar";

import { StyledPageWrapper, StickyContainer, StickyItem, StickyItemSibling } from "./styles";

const stepsList = [
  { step: 1, label: "Atur Kualifikasi" },
  { step: 2, label: "Skor Kualifikasi" },
  { step: 3, label: "Atur Eliminasi" },
  { step: 4, label: "Skor Eliminasi" },
];

const scheduleTabs = [
  { step: 1, label: "Jadwal" },
  { step: 2, label: "Bantalan" },
];

const PageEventDetailSchedulingScoring = () => {
  const { event_id } = useParams();
  const { currentStep, goToStep } = useWizardView(stepsList);

  const eventId = parseInt(event_id);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Atur Jadwal dan Skor Pertandingan | MyArchery.id</title>
      </MetaTags>

      <StyledPageWrapper>
        <Container fluid>
          <BreadcrumbDashboard to={`/dashboard/event/${eventId}/home`}>Kembali</BreadcrumbDashboard>

          <StickyContainer>
            <StickyItem>
              <StepsList
                title="Jadwal &amp; Scoring"
                currentStep={currentStep}
                onChange={(step) => goToStep(step)}
              >
                <StepItem step="1" icon={<IconTarget size="20" />}>
                  Atur Kualifikasi
                </StepItem>

                <StepItem step="2" disabled icon={<IconScoreboard size="20" />}>
                  Skor Kualifikasi
                </StepItem>

                <StepItem step="3" disabled icon={<IconBranch size="20" />}>
                  Atur Eliminasi
                </StepItem>

                <StepItem step="4" disabled icon={<IconDiagram size="20" />}>
                  Skor Eliminasi
                </StepItem>
              </StepsList>
            </StickyItem>

            <StickyItemSibling>
              <WizardView currentStep={currentStep}>
                <WizardViewContent>
                  <div>
                    <FolderTabs tabs={scheduleTabs}>
                      <TabItem tab="1" icon={<IconCalendar size="16" />}>
                        Jadwal
                      </TabItem>

                      <TabItem disabled tab="2" icon={<IconCalendar size="16" />}>
                        Bantalan
                      </TabItem>
                    </FolderTabs>

                    <FolderPanel>
                    </FolderPanel>
                  </div>
                </WizardViewContent>
              </WizardView>
            </StickyItemSibling>
          </StickyContainer>
        </Container>
      </StyledPageWrapper>
    </React.Fragment>
  );
};

export default PageEventDetailSchedulingScoring;
