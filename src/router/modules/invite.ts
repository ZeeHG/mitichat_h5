import { RouteRecordRaw } from "vue-router";

const inviteRouters: Array<RouteRecordRaw> = [
  {
    path: "/invite",
    name: "invite",
    component: () => import("@pages/invite/index.vue"),
  },
];

export default inviteRouters;
