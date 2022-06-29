import * as React from "react";
import { useParticipantScorings } from "../hooks/participant-scorings";

function ScoringTable({ categoryDetail, onEmptyData }) {
  const teamType = categoryDetail?.categoryTeam?.toLowerCase?.();

  const { data, isLoading, isFetching } = useParticipantScorings({
    categoryId: categoryDetail.id,
    teamType,
    shouldPoll: true,
  });

  // Nge-skip yang gak ada datanya
  React.useEffect(() => {
    if (!data || data.length) {
      return;
    }
    onEmptyData?.();
  }, [data]);

  // TODO: pakai UI table yang aslinya
  if (isLoading) {
    return (
      <div
        style={{
          overflow: "auto",
          height: 400,
          textAlign: "left",
          fontSize: "0.875rem",
          fontweight: 400,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <React.Fragment>
      <div style={{ opacity: isFetching ? 1 : 0 }}>Refetching...</div>
      <div
        style={{
          overflow: "auto",
          height: 400,
          textAlign: "left",
          fontSize: "0.875rem",
          fontweight: 400,
        }}
      >
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </React.Fragment>
  );
}

export { ScoringTable };
