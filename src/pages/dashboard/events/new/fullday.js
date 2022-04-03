import * as React from "react";
import { EventsNewFullday as EventsNewFulldayLegacy } from "./legacy/fullday";
import { PageCreateEventFullday } from "./fullday-v2";

function EventsNewFullday() {
  return (
    <React.Fragment>
      <PageCreateEventFullday />

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
