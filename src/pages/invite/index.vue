<template>
  <iframe
    :value="iframeSrc"
    ref="iframe"
    style="display: none; width: 0; height: 0"
  ></iframe>
  <div class="button" @click="openApp">
    <span>test</span>
  </div>
  <div>
    <h1>Invite Page</h1>
    <p v-if="inviterInfo">Invited by: {{ inviterInfo.name }}</p>
    <img
      v-if="inviterInfo"
      :src="inviterInfo.avatar_url"
      alt="Inviter's Avatar"
    />
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const inviterInfo = ref({ name: String, avatar_url: String });
const iframeSrc = ref("");
const iframe = ref(null);
const iframeConfig = {
  iosScheme: "com.example.app://",
  iosStoreLink: "https://apps.apple.com/app/miti-chat/id6474599696",
  androidScheme: "com.example.app://",
  androidStoreLink: "https://play.google.com/store/apps/details?id=miti.chat",
  fallbackUrl: "https:/www.miti.chat",
};

onMounted(async () => {
  const inviteCode = route.params.code;
  if (inviteCode) {
    try {
      const response = await axios.get(`/api/invite_info?code=${inviteCode}`);
      inviterInfo.value = response.data;
    } catch (error) {
      console.error("Failed to fetch inviter info:", error);
    }
  }
});
function openApp() {
  const userAgent = navigator.userAgent;
  const startTime = new Date().getTime();
  console.log(startTime);
  console.log(userAgent);

  if (/iPhone|iPod|iPad/i.test(userAgent)) {
    iframeSrc.value = iframeConfig.iosScheme;

    setTimeout(() => {
      const endTime = new Date().getTime();
      if (endTime - startTime < 2000) {
        window.location.href = iframeConfig.iosStoreLink;
      }
    }, 1000);
  } else if (/android/i.test(userAgent)) {
    iframeSrc.value = iframeConfig.androidScheme;

    setTimeout(() => {
      const endTime = new Date().getTime();
      if (endTime - startTime < 2000) {
        window.location.href = iframeConfig.androidStoreLink;
      }
    }, 1000);

    iframeSrc.value = "";
  } else {
    window.location.href = iframeConfig.fallbackUrl;
  }
  console.log(iframeSrc.value);
}
</script>
