import { RouteRecordRaw } from "vue-router";

const momentsRouters: Array<RouteRecordRaw> = [
  {
    path: "/moments",
    name: "Moments",
    component: () => import("@pages/moments/index/index.vue"),
  },
  {
    path: "/interactiveMessage",
    name: "InteractiveMessage",
    component: () => import("@pages/moments/interactiveMessage/index.vue"),
  },
  {
    path: "/momentsRelease",
    name: "momentsRelease",
    component: () => import("@pages/moments/momentsRelease/index.vue"),
    props: ({ query }) => ({
      momentsType: Number(query.momentsType),
    }),
  },
  {
    path: "/momentsVisibility",
    name: "momentsVisibility",
    component: () => import("@pages/moments/momentsVisibility/index.vue"),
  },
  {
    path: "/momentsDetails",
    name: "momentsDetails",
    component: () => import("@pages/moments/momentsDetails/index.vue"),
    props: ({ query }) => ({
      workMomentID: query.workMomentID as string,
    }),
  },
  {
    path: "/designatedMoments",
    name: "designatedMoments",
    component: () => import("@pages/moments/designatedMoments/index.vue"),
  },
];

export default momentsRouters;
