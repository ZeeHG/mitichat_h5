<template>
  <van-tabbar :border="false" fixed safe-area-inset-bottom placeholder route>
    <van-tabbar-item to="/conversation" :badge="conversationStore.storeUnReadCount"
      :badge-props="{ max: 99, showZero: false }">
      <span>{{ $t('chat') }}</span>
      <template #icon="props">
        <img :src="props.active ? conversation_active : conversation" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/moments" :badge-props="{ max: 99, showZero: false }">
      <span>{{ $t('discover') }}</span>
      <template #icon="props">
        <img :src="props.active ? discover_active : discover" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/moments">
      <span>{{ $t('workbench') }}</span>
      <template #icon="props">
        <img :src="props.active ? workbench_active : workbench" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/profile">
      <span>{{ $t('profile') }}</span>
      <template #icon="props">
        <img :src="props.active ? profile_active : profile" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang='ts'>
import conversation from "@assets/images/tabbar/conversation.png";
import conversation_active from "@assets/images/tabbar/conversation_active.png";

import discover from "@assets/images/tabbar/discover.png";
import discover_active from "@assets/images/tabbar/discover_active.png";

import workbench from '@assets/images/tabbar/workbench.png'
import workbench_active from '@assets/images/tabbar/workbench_active.png'

import profile from "@assets/images/tabbar/profile.png";
import profile_active from "@assets/images/tabbar/profile_active.png";

import useConversationStore from "@/store/modules/conversation";

const conversationStore = useConversationStore();

</script>

<style lang='scss' scoped>
:deep(.van-tabbar) {
  height: 56px;
  border-top: 1px solid #EAEAEA;
  background-color: #FFFFFF;
}

:deep(.van-tabbar-item__icon img) {
  height: 22px;
  vertical-align: bottom;
}

:deep(.van-tabbar-item) {
  color: #B3B3B3;
}

:deep(.van-tabbar-item--active) {
  color: var(--van-tabbar-item-active-color);
}

:deep(.van-tabbar-item__text) {
  font-size: 11px;
}
</style>