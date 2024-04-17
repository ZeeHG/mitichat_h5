import { RouteRecordRaw } from "vue-router";

const conversationRouters: Array<RouteRecordRaw> = [
  {
    path: "/myChat",
    name: "Chat",
    component: () => import("@pages/conversation/chat/index.vue"),
  },
  {
    path: "/singleSetting",
    name: "SingleSetting",
    component: () => import("@pages/conversation/singleSetting/index.vue"),
  },
  {
    path: "/groupSetting",
    name: "GroupSetting",
    component: () => import("@pages/conversation/groupSetting/index.vue"),
  },
  {
    path: "/groupManage",
    name: "GroupManage",
    component: () => import("@pages/conversation/groupManage/index.vue"),
  },
  {
    path: "/groupAnnouncement",
    name: "GroupAnnouncement",
    props: ({ query }) => ({
      isNomal: JSON.parse(query.isNomal as string),
    }),
    component: () => import("@pages/conversation/groupAnnouncement/index.vue"),
  },
  {
    path: "/notifyMessageList",
    name: "NotifyMessageList",
    component: () => import("@pages/conversation/notifyMessageList/index.vue"),
  },
  {
    path: "/previewLocation",
    name: "PreviewLocation",
    component: () => import("@pages/conversation/previewLocation/index.vue"),
  },
  {
    path: "/previewMergeMessage/:id",
    name: "PreviewMergeMessage",
    component: () =>
      import("@pages/conversation/previewMergeMessage/index.vue"),
  },
  {
    path: "/previewVideo",
    name: "PreviewVideo",
    props: ({ query }) => ({
      url: query.url,
      poster: query.poster,
    }),
    component: () => import("@pages/conversation/previewVideo/index.vue"),
  },
  {
    path: "/searchFileMessage",
    name: "SearchFileMessage",
    component: () => import("@pages/conversation/searchFileMessage/index.vue"),
  },
  {
    path: "/searchMediaMessage",
    name: "SearchMediaMessage",
    props: ({ query }) => ({
      isVideo: query.isVideo === "true",
    }),
    component: () => import("@pages/conversation/searchMediaMessage/index.vue"),
  },
  {
    path: "/searchMessage",
    name: "SearchMessage",
    component: () => import("@pages/conversation/searchMessage/index.vue"),
  },
  {
    path: "/changeName",
    name: "ChangeName",
    props: ({ query }) => ({
      originData: JSON.parse(query.originData as string),
      isGroup: query.isGroup,
    }),
    component: () => import("@pages/conversation/changeName/index.vue"),
  },
  {
    path: "/previewHistoryMessage",
    name: "PreviewHistoryMessage",
    component: () =>
      import("@pages/conversation/previewHistoryMessage/index.vue"),
  },
  {
    path: "/groupMessageRead",
    name: "GroupMessageRead",
    component: () => import("@pages/conversation/groupMessageRead/index.vue"),
  },
  {
    path: "/globalSearch",
    name: "GlobalSearch",
    component: () => import("@pages/conversation/globalSearch/index.vue"),
  },
  {
    path: "/geolacationPage",
    name: "GeolacationPage",
    component: () => import("@pages/conversation/geolacationPage/index.vue"),
  },
];

export default conversationRouters;
