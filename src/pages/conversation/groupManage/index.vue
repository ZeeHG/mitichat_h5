<template>
  <div class="page_container">
    <NavBar :title="$t('groupManage')" />

    <div v-if="isOwner" class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
      <SettingRowItem :title="$t('allMute')" show-switch :loading="switchLoading.mute"
        :checked="conversationStore.storeCurrentGroupInfo.status === GroupStatus.Muted" @updateValue="updateMute" />
    </div>

    <div class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
      <SettingRowItem :title="$t('notAllowLookMemberInfo')" show-switch :loading="switchLoading.look"
        :checked="conversationStore.storeCurrentGroupInfo.lookMemberInfo === AllowType.NotAllowed"
        @updateValue="updateLookAuthority" />
      <SettingRowItem :title="$t('notAllowApplyMember')" show-switch :loading="switchLoading.friend"
        :checked="conversationStore.storeCurrentGroupInfo.applyMemberFriend === AllowType.NotAllowed"
        @updateValue="updateFriendAuthority" />
      <SettingRowItem :title="$t('groupAccess')" :sub-title="groupAccessStr" @click-item="openGroupAccessSheet" />
    </div>

    <div v-if="isOwner" class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
      <SettingRowItem :title="$t('groupTransfer')" @click="groupTransfer" />
    </div>

    <van-action-sheet v-model:show="actionSheetVisible" :actions="groupAccessActions" @select="onActionSelect"
      :cancel-text="$t('buttons.cancel')" />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import SettingRowItem from "@/components/SettingRowItem/index.vue";
import useCurrentMemberRole from "@/hooks/useCurrentMemberRole";
import { MemberListActionEnum } from "@/pages/contact/groupMemberList/data";
import useConversationStore from '@/store/modules/conversation';
import { feedbackToast } from '@/utils/common';
import { IMSDK } from '@/utils/imCommon';
import { AllowType, GroupStatus, GroupVerificationType } from '@/utils/open-im-sdk-wasm/types/enum';
import { ActionSheetAction } from "vant";


const { t } = useI18n();
const router = useRouter();
const { isNomal, isOwner } = useCurrentMemberRole();
const conversationStore = useConversationStore()

const groupAccessActions: ActionSheetAction[] = [
  {
    name: t("applyRequired"),
  },
  {
    name: t("allRequired"),
  },
  {
    name: t("notRequired"),
  },
];

const actionSheetVisible = ref(false);

const switchLoading = reactive({
  mute: false,
  look: false,
  friend: false
})

const groupAccessStr = computed(
  () => groupAccessActions[conversationStore.storeCurrentGroupInfo.needVerification].name
);

const updateLookAuthority = (flag: boolean) => {
  switchLoading.look = true
  IMSDK.setGroupLookMemberInfo({
    rule: flag ? AllowType.NotAllowed : AllowType.Allowed,
    groupID: conversationStore.storeCurrentConversation.groupID
  })
    .catch(error => feedbackToast({ error }))
    .finally(() => switchLoading.look = false)
}

const updateFriendAuthority = (flag: boolean) => {
  switchLoading.friend = true
  IMSDK.setGroupApplyMemberFriend({
    rule: flag ? AllowType.NotAllowed : AllowType.Allowed,
    groupID: conversationStore.storeCurrentConversation.groupID
  })
    .catch(error => feedbackToast({ error }))
    .finally(() => switchLoading.friend = false)
}

const updateMute = (flag: boolean) => {
  switchLoading.mute = true
  IMSDK.changeGroupMute({
    isMute: flag,
    groupID: conversationStore.storeCurrentConversation.groupID
  })
    .catch(error => feedbackToast({ error }))
    .finally(() => switchLoading.mute = false)
}

const openGroupAccessSheet = () => {
  if (!isNomal.value) {
    actionSheetVisible.value = true;
  }
};

const onActionSelect = async (
  _: unknown,
  verification: GroupVerificationType
) => {
  let error;
  try {
    await IMSDK.setGroupVerification({
      groupID: conversationStore.storeCurrentConversation.groupID,
      verification,
    });
  } catch (error) {
    error = error;
  }
  actionSheetVisible.value = false
  feedbackToast({ error });
};

const groupTransfer = () => {
  router.push({
    path: 'groupMemberList',
    state: {
      groupID: conversationStore.storeCurrentGroupInfo.groupID,
      action: MemberListActionEnum.Transfer
    }
  })
}
</script>