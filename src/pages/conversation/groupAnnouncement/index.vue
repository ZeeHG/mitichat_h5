<template>
  <div class="page_container">
    <NavBar :title="$t('popover.groupAnnouncement')">
      <span v-if="!editing && !isNomal" @click="editing = true">{{ $t('buttons.edit') }}</span>
      <span v-if="editing" @click="finishEdit">{{ $t('buttons.release') }}</span>
    </NavBar>
    <div class="flex flex-1 flex-col px-[22px] py-3 mx-[10px] mt-[10px] mb-[30px] bg-white rounded-md overflow-hidden">
      <div v-if="!editing && pusherInfo" class="flex flex-row">
        <Avatar :src="pusherInfo.faceURL" :desc="pusherInfo.nickname" :size="42" />
        <div class="flex flex-col ml-4">
          <div>{{ pusherInfo.nickname }}</div>
          <div class="text-xs text-[#999]">{{ pusherTimeStr }}</div>
        </div>
      </div>
      <div class="flex-1 relative">
        <van-field class="!px-0" v-model="content" autosize type="textarea" :readonly="!editing" placeholder="" />
        <div v-if="!editing && isNomal" class="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#999]">
          {{ $t('ownerAndAdminCanEdit') }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';
import useConversationStore from '@/store/modules/conversation';
import { GroupMemberItem } from '@/utils/open-im-sdk-wasm/types/entity';
import dayjs from 'dayjs';

defineProps<{ isNomal: boolean }>();

const { t } = useI18n()
const conversationStore = useConversationStore();

const pusherInfo = ref<GroupMemberItem>()
const content = ref(conversationStore.storeCurrentGroupInfo.notification)
const editing = ref(false)
const loading = ref(false)

const pusherTimeStr = computed(() => {
  if (conversationStore.storeCurrentGroupInfo.notificationUpdateTime) {
    return dayjs(conversationStore.storeCurrentGroupInfo.notificationUpdateTime).format('YYYY-M-D HH:mm')
  }
  return ''
})

const finishEdit = () => {
  loading.value = true
  IMSDK.setGroupInfo({
    groupID: conversationStore.storeCurrentGroupInfo.groupID,
    notification: content.value
  }).then(() => feedbackToast({ message: t('messageTip.changeSuccess'), duration: 200, onClose: () => editing.value = false }))
    .catch((error) => feedbackToast({ message: t('messageTip.changeFailed'), error }))
    .finally(() => loading.value = false)

}

const getPusherInfo = (userID: string) => {
  IMSDK.getSpecifiedGroupMembersInfo<GroupMemberItem[]>({
    groupID: conversationStore.storeCurrentGroupInfo.groupID,
    userIDList: [userID]
  })
    .then(({ data }) => {
      pusherInfo.value = data[0]
    })
}

onBeforeMount(() => {
  if (conversationStore.storeCurrentGroupInfo.notificationUserID) {
    getPusherInfo(conversationStore.storeCurrentGroupInfo.notificationUserID)
  }
})

watch(() => conversationStore.storeCurrentGroupInfo.notificationUserID, (newVal) => {
  getPusherInfo(newVal)
})

</script>

<style lang='scss' scoped>
.van-field {
  height: 100%;
  padding: 12px 22px;

  :deep(.van-field__body) {
    height: 100%;

    .van-field__control {
      height: 100% !important;
    }
  }
}

.van-cell::after {
  content: none;
  border: none;
}
</style>