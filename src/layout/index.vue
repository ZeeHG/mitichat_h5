<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-hidden">
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive include="profile,contact,conversation">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script setup lang="ts" name="tabbar">
import Tabbar from "./Tabbar.vue";
import useConversationStore from "@/store/modules/conversation";
import { AllowType, LoginStatus } from "@/utils/open-im-sdk-wasm/types/enum";
import useContactStore from "@/store/modules/contact";
import { useGlobalEvent } from "./useGlobalEvent";
import { getApiUrl, getIMToken, getIMUserID, getWsUrl } from "@/utils/storage";
import { IMSDK, initStore } from "@/utils/imCommon";
import useMessageStore from "@/store/modules/message";
import { PostThirdCode } from "@api/login";
import { setIMProfile } from "@/utils/storage";
useGlobalEvent();
const router = useRouter();

onMounted(() => {
  loginCheck();
});

router.beforeEach(async (to, from, next) => {
  const urlParams = new URLSearchParams(window.location.hash);
  const idToken = urlParams.get("id_token");

  if (to.path === "/getCode") {
    next();
    return;
  }
  if (from.path === "/login") {
    const { data } = await IMSDK.getLoginStatus<LoginStatus>();
    if (data === LoginStatus.Logout) {
      loginCheck();
    }
  }
  next();
});
const GetAndPostThirdCode = async () => {
  let currentThird = localStorage.getItem("thirdLogin");
  let clientId = localStorage.getItem("clientId") || "";
  let registerType = null;
  let type = null;
  const { hash } = router.currentRoute.value;
  if (hash) {
    if (currentThird === "GOOGLE") {
      let idToken = hash.split("id_token=")[1]?.split("&")[0];
      type = "GOOGLE";
      registerType = 3;
      localStorage.setItem("GOOGLE_ID_TOKEN", idToken);
      const data = await PostThirdCode(idToken, registerType, clientId);
      const { chatToken, imToken, userID } = data;
      setIMProfile({ chatToken, imToken, userID });
      localStorage.removeItem("GOOGLE_ID_TOKEN");
    } else if (currentThird === "APPLE") {
      let idToken = hash.split("id_token=")[1]?.split("&")[0];
      type = "APPLE";
      registerType = 4;
      localStorage.setItem("APPLE_ID_TOKEN", idToken);
      const data = await PostThirdCode(idToken, registerType, clientId);
      const { chatToken, imToken, userID } = data;
      setIMProfile({ chatToken, imToken, userID });
      localStorage.removeItem("APPLE_ID_TOKEN");
    } else if (currentThird === "FACEBOOK") {
      // type = "FACEBOOK";
      // registerType = 5;
      // localStorage.setItem("FACEBOOK_ID_TOKEN", idToken);
      // const data = await PostThirdCode(idToken, registerType, clientId);
      // const { chatToken, imToken, userID } = data;
      // setIMProfile({ chatToken, imToken, userID });
      // localStorage.removeItem("FACEBOOK_ID_TOKEN");
    }
    localStorage.removeItem("thirdLogin");
    localStorage.removeItem("clientId");
  }
};
const loginCheck = async () => {
  if (localStorage.getItem("thirdLogin")) await GetAndPostThirdCode();
  const IMToken = getIMToken();
  const IMUserID = getIMUserID();
  if (!IMToken || !IMUserID) {
    router.push("/login");
    return;
  }
  tryLogin();
};

const tryLogin = async () => {
  const IMToken = getIMToken();
  const IMUserID = getIMUserID();
  try {
    await IMSDK.login({
      userID: IMUserID!,
      token: IMToken!,
      apiAddr: getApiUrl(),
      wsAddr: getWsUrl(),
      platformID: 5,
    });
    initStore();
    useMessageStore().initMsgTranslate(IMUserID!);
  } catch (error) {
    router.push("/login");
  }
};

window.userClick = (userID?: string, groupID?: string) => {
  const conversationStore = useConversationStore();
  const contactStore = useContactStore();
  if (!userID || userID === "AtAllTag") return;

  const currentGroupInfo = conversationStore.currentGroupInfo;

  if (groupID && currentGroupInfo?.lookMemberInfo === AllowType.NotAllowed) {
    return;
  }

  contactStore.getUserCardData(userID, groupID);
};
</script>

<style lang="scss" scoped></style>
