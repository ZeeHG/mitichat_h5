import { RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import router from "..";

const checkBaseData = ({ query }: RouteLocationNormalized) => {
  let baseData;
  try {
    baseData = JSON.parse(query.baseData as string);
  } catch (error) {
    router.replace("login");
  }
  return {
    baseData,
  };
};

const loginRouters: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@pages/login/index/index.vue"),
  },
  {
    path: "/config",
    name: "Config",
    component: () => import("@pages/login/index/Config.vue"),
  },
  {
    path: "/getCode",
    name: "GetCode",
    props: ({ query }) => {
      let isRegiste;
      try {
        isRegiste = JSON.parse(query.isRegiste as string);
      } catch (error) {}
      return {
        isRegiste,
      };
    },
    component: () => import("@pages/login/getCode/index.vue"),
  },
  {
    path: "/verifyCode",
    name: "VerifyCode",
    props: checkBaseData,
    component: () => import("@pages/login/verifyCode/index.vue"),
  },
  {
    path: "/setPassword",
    name: "SetPassword",
    props: checkBaseData,
    component: () => import("@pages/login/setPassword/index.vue"),
  },
  {
    path: "/setBaseInfo",
    name: "SetBaseInfo",
    props: ({ query }) => {
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState({}, "", url.href);
      });
      let baseData;
      try {
        baseData = JSON.parse(query.baseData as string);
      } catch (error) {
        router.replace("login");
      }
      return {
        baseData,
      };
    },
    component: () => import("@pages/login/setBaseInfo/index.vue"),
  },
  // {
  //   path: "/chooseAvatar",
  //   name: "ChooseAvatar",
  //   component: () => import("@pages/login/chooseAvatar/index.vue"),
  // },
];

export default loginRouters;
