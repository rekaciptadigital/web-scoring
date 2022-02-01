import * as React from "react";
import { useWizardView } from "utils/hooks/wizard-view";

import { StyledTabs, StyledButtonItem, IconWrapper, FolderPanel } from "./styles";

import classnames from "classnames";

const TabsContext = React.createContext();

function FolderTabs({ children, tabs }) {
  const { currentStep: currentTab, goToStep: switchToTab } = useWizardView(tabs);
  return (
    <TabsContext.Provider value={{ currentTab, switchToTab }}>
      <StyledTabs>{children}</StyledTabs>
    </TabsContext.Provider>
  );
}

function TabItem({ children, disabled: disabledProp, icon, tab: tabProp }) {
  const { currentTab, switchToTab } = React.useContext(TabsContext);
  const tab = parseInt(tabProp);

  return (
    <div>
      <StyledButtonItem
        onClick={() => switchToTab(tab)}
        disabled={tab === currentTab || disabledProp}
        className={classnames({ "tab-disabled": disabledProp })}
      >
        {icon && tab === currentTab && <IconWrapper>{icon}</IconWrapper>}
        <span>{children}</span>
      </StyledButtonItem>
    </div>
  );
}

export { FolderTabs, TabItem, FolderPanel };
