import * as React from "react";

import {
  KnobGroupLayout,
  KnobsClassCategories,
  KnobsTeamCategories,
} from "components/ma/toolbar-filters";

function SelectionKnobsView() {
  return (
    <KnobGroupLayout>
      <KnobsClassCategories />
      <KnobsTeamCategories
        shouldHideOption={(option) => {
          return !["individu male", "individu female"].includes(option.value);
        }}
      />
    </KnobGroupLayout>
  );
}

export { SelectionKnobsView };
