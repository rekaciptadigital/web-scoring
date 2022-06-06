// Dashboard
import EventsNewFullday from "pages/dashboard/events/new/fullday";
import EventsNewMarathon from "pages/dashboard/events/new/marathon";
import PreWizard from "pages/dashboard/events/new/pre-wizard";
import PagePrePublish from "pages/dashboard/events/new/pre-publish";
import PageCongratulations from "pages/dashboard/events/new/congratulations";
import ScoringNew from "pages/dashboard/scoring/new";
import Dashboard from "../pages/dashboard";
import PageEventDetailHome from "../pages/dashboard/events/home";
import PageEventBudRests from "../pages/dashboard/events/budrests";
import PageEventBudRestDetail from "../pages/dashboard/events/budrests/detail";
import PageEventFaqs from "../pages/dashboard/events/faqs";
import PageEventScoringQualification from "pages/dashboard/events/scoring-qualification";
import PageEventScoringElimination from "pages/dashboard/events/scoring-elimination";
import PageEventDetailSchedulingScoring from "pages/dashboard/events/scheduling-scoring";
import PageConfigEliminationDetail from "pages/dashboard/events/scheduling-scoring/views/manage-elimination-detail";
import ListCategory from "../pages/dashboard/category";
import ListEvent from "../pages/dashboard/events";
import EventsNew from "../pages/dashboard/events/new";
import ListMember from "../pages/dashboard/member";
import ListScoring from "../pages/dashboard/scoring";
import ListResult from "pages/dashboard/results";
import Bagan from "pages/dashboard/results/bagan";
import EditResult from "pages/dashboard/results/edit";
import ListSchedule from "../pages/dashboard/schedule";
import Eliminasi from "../pages/dashboard/eliminasi";
import PageEventOfficial from "pages/dashboard/events/official";
import PageEventIdCard from "pages/dashboard/events/id-card";
import DashboardDos from "../pages/dashboard/dos";

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard/events", component: ListEvent },
  { path: "/dashboard/event/:event_id/home", component: PageEventDetailHome },
  { path: "/dashboard/event/:event_id/manage", component: EventsNewFullday },
  { path: "/dashboard/event/:event_id/budrests", component: PageEventBudRests },
  { path: "/dashboard/event/:event_id/budrests/detail", component: PageEventBudRestDetail },
  { path: "/dashboard/event/:event_id/faqs", component: PageEventFaqs },
  { path: "/dashboard/event/id-card/:event_id", component: PageEventIdCard },
  { path: "/dashboard/event/:event_id/official", component: PageEventOfficial },
  {
    path: "/dashboard/event/:event_id/scoring-qualification",
    component: PageEventScoringQualification,
  },
  {
    path: "/dashboard/event/:event_id/scoring-elimination",
    component: PageEventScoringElimination,
  },
  {
    path: "/dashboard/event/:event_id/scheduling-scoring",
    component: PageEventDetailSchedulingScoring,
  },
  {
    path: "/dashboard/event/:event_id/scheduling-scoring/elimination",
    component: PageConfigEliminationDetail,
  },
  { path: "/dashboard/member/:event_id", component: ListMember },
  { path: "/dashboard/category", component: ListCategory },
  { path: "/dashboard/scoring", component: ListScoring },
  { path: "/dashboard/scoring/new", component: ScoringNew },
  { path: "/dashboard/result", component: ListResult },
  { path: "/dashboard/result/bagan", component: Bagan },
  { path: "/dashboard/result/edit", component: EditResult },
  { path: "/dashboard/schedule/:event_id", component: ListSchedule },
  { path: "/dashboard/eliminasi/:event_id", component: Eliminasi },

  { path: "/dashboard/events/new/prepare", component: PreWizard },
  { path: "/dashboard/events/new/prepublish", component: PagePrePublish },
  { path: "/dashboard/events/new/congratulations", component: PageCongratulations },

  // this route should be at the end of all other routes
  { path: "/dashboard/events/new", component: EventsNew },
  { path: "/dashboard/events/new/fullday", component: EventsNewFullday },
  { path: "/dashboard/events/new/marathon", component: EventsNewMarathon },

  { path: "/dashboard/event/:event_id/dos", component: DashboardDos},
];

export default dashboardRoutes;
