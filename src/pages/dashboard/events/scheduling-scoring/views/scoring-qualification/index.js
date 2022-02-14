import * as React from "react";
import { useWizardView } from "utils/hooks/wizard-view";

import { WizardView, WizardViewContent } from "components/ma";
import { FolderTabs, TabItem, TabsContext } from "../../components";
import { TabContentScoringMale } from "./tab-content-scoring-male";
import { TabContentScoringFemale } from "./tab-content-scoring-female";

import IconUser from "components/ma/icons/mono/user";

const tabsList = [
  { step: 1, label: "Individu Putra" },
  { step: 2, label: "Individu Putri" },
];

function StepScoringQualification() {
  const { currentStep: currentTab, goToStep: switchToTab } = useWizardView(tabsList);

  return (
    <div>
      <TabsContext.Provider value={{ currentTab, switchToTab }}>
        <FolderTabs>
          <TabItem tab="1" icon={<IconUser size="16" />}>
            Individu Putra
          </TabItem>

          <TabItem tab="2" icon={<IconUser size="16" />}>
            Individu Putri
          </TabItem>
        </FolderTabs>

        <WizardView currentStep={currentTab}>
          <WizardViewContent>
            <TabContentScoringMale />
          </WizardViewContent>

          <WizardViewContent>
            <TabContentScoringFemale />
          </WizardViewContent>
        </WizardView>
      </TabsContext.Provider>
    </div>
  );
}

export { StepScoringQualification };
