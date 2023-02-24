import * as React from "react";
import { EventsNewFullday as EventsNewFulldayLegacy } from "./legacy/fullday";
import { PageCreateEventFullday } from "./fullday-v2";
import { useClassification } from "./hooks/form-classification";
import CreateNewCategory from "./createNewCategory";

function EventsNewFullday() {
  const classification = useClassification();
  const { currentView } = classification;
  console.log(currentView);
  return (
    <React.Fragment>
      {currentView === 1 ? (
        <PageCreateEventFullday classification={classification} />
      ) : currentView === 2 ? (
        <CreateNewCategory classification={classification} />
      ) : null}

      {false && (
        <React.Fragment>
          <hr />
          <EventsNewFulldayLegacy />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default EventsNewFullday;
