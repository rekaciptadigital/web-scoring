import * as React from "react";
import { useDisplaySettings } from "../contexts/display-settings";

import { ScoringTable } from "./scoring-table";
import { ScoringElimination } from "./scoring-elimination";

function TableView() {
  const { activeCategoryDetail, isQualification, isElimination } = useDisplaySettings();

  if (!activeCategoryDetail) {
    return null;
  }

  if (isQualification) {
    // Kasih key biar unmount/re-mount tiap ganti ketegori
    // buat ngereset state lokalnya
    return <ScoringTable key={activeCategoryDetail.id} />;
  }

  if (isElimination) {
    return <ScoringElimination key={activeCategoryDetail.id} />;
  }

  return null;
}

export { TableView };
