import * as React from "react";
import { EventsNewFullday as EventsNewFulldayLegacy } from "./legacy/fullday";
import { PageCreateEventFullday } from "./fullday-v2";
import { useClassification } from "./hooks/form-classification";
import CreateNewClassification from "./create-new-classification";
import { useUserProfile } from "hooks/user-profile";

function EventsNewFullday() {
  const classification = useClassification();
  const { currentView } = classification;
  const userData = useUserProfile();
  return (
    <React.Fragment>
      {currentView === 1 ? (
        <PageCreateEventFullday classification={classification} />
      ) : currentView === 2 ? (
        <CreateNewClassification
          classification={classification}
          userData={userData}
        />
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
