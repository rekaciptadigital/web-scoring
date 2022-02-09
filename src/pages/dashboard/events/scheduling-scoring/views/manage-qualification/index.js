import * as React from "react";
import { useWizardView } from "utils/hooks/wizard-view";

import { WizardView, WizardViewContent } from "components/ma";
import { FolderTabs, TabItem, TabsContext } from "../../components";
import { TabScheduling } from "./tab-scheduling";
import { TabBudRest } from "./tab-budrest";

import IconCalendar from "components/ma/icons/mono/calendar";
import IconBudRest from "components/ma/icons/mono/bud-rest";

const scheduleTabs = [
  { step: 1, label: "Jadwal" },
  { step: 2, label: "Bantalan" },
];

function StepManageQualification({ eventId }) {
  const { currentStep: currentTab, goToStep: switchToTab } = useWizardView(scheduleTabs);

  return (
    <div>
      <TabsContext.Provider value={{ currentTab, switchToTab }}>
        <FolderTabs>
          <TabItem tab="1" icon={<IconCalendar size="16" />}>
            Jadwal
          </TabItem>

          <TabItem tab="2" icon={<IconBudRest size="16" />}>
            Bantalan
          </TabItem>
        </FolderTabs>

        <WizardView currentStep={currentTab}>
          <WizardViewContent>
            <TabScheduling eventId={eventId} />
          </WizardViewContent>

          <WizardViewContent>
            <TabBudRest />
          </WizardViewContent>
        </WizardView>
      </TabsContext.Provider>
    </div>
  );
}

export { StepManageQualification };
