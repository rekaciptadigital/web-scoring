import PageLiveScore from "pages/live-scores-qualification";

const liveScoreRoutes = [
  { path: "/live-score/:event_id/qualification", component: PageLiveScore },
  // TODO:
  // { path: "/live-score/:event_id/elimination", component: PageLiveScoreElimination },
];

export default liveScoreRoutes;
