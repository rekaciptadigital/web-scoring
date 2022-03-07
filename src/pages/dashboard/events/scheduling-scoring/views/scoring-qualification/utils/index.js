import { isPast } from "date-fns";

function makeOptionsFromData(data) {
  if (!data) {
    return [];
  }

  const options = data.map((detail) => {
    const labelText = [
      detail.competitionCategory,
      detail.ageCategory,
      detail.distancesCategory,
    ].join(" - ");
    return { value: detail.eventCategoryDetailsId, label: labelText };
  });
  return options || [];
}

function handleUrlFromResponse(url) {
  const API_URL = process.env.REACT_APP_API_URL || "https://api-staging.myarchery.id";
  const segments = url.split("/");
  const assetSegmentIndex = segments.findIndex((segment) => segment === "asset");
  const downloadUrl = API_URL + "/" + segments.slice(assetSegmentIndex).join("/");
  return downloadUrl;
}

function shouldDisableEditing(eventDateEnd) {
  if (!eventDateEnd) {
    return true;
  }
  return isPast(eventDateEnd);
}

export { makeOptionsFromData, handleUrlFromResponse, shouldDisableEditing };
