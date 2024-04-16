<template>
  <div class="page_container">
    <NavBar :title="$t('groupSetting')" />

    <div class="overflow-y-auto flex-1">
      <div class="flex items-center bg-white p-4 mt-[10px] mx-[10px] rounded-md">
        <div class="relative w-12 h-12">
          <Avatar :size="48" :src="conversationStore.currentConversation.faceURL" is-group @click="chooseAvatar" />
          <img v-if="isOwner || isAdmin" class="w-[14px] h-[14px] absolute right-[-4px] bottom-[-4px]" :src="edit_icon"
            alt="" />
        </div>

        <div class="flex flex-1 h-[48px] flex-col items-start ml-[10px]" @click="toChangeName(true)">
          <div class="flex items-center justify-start">
            <span class="text-base">{{ conversationStore.currentConversation.showName }}</span>
            <span class="text-base">{{ "(" }}</span>
            <span class="text-base">{{ conversationStore.storeCurrentGroupInfo.memberCount }}</span>
            <span class="text-base">{{ ")" }}</span>
            <img v-if="isOwner || isAdmin" class="w-[12px] h-[12px] ml-1.5" :src="edit" alt="">
          </div>

          <span class="text-sm text-sub-text mt-1">{{ conversationStore.storeCurrentGroupInfo.groupID }}</span>
        </div>
        <img class="w-[18px] h-[18px]" @click="toGroupQr" :src="qr" alt="">
      </div>

      <GroupMemberRow :member-count="conversationStore.storeCurrentGroupInfo.memberCount" :is-nomal="isNomal" />

      <div class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
        <SettingRowItem :title="$t('groupName')" @click="toChangeName(true)" />
        <SettingRowItem :title="$t('groupQrCode')" @click="toGroupQr" />
        <SettingRowItem :title="$t('popover.groupAnnouncement')" @click="toGroupAnnounce" />
        <SettingRowItem v-if="isOwner || isAdmin" :title="$t('groupManage')" @click="toGroupManage" />
      </div>

      <SettingSearch />  

      <div class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
        <SettingRowItem :title="$t('checks.notDisturb')" show-switch :loading="switchLoading.recvMsgLoading"
          :checked="conversationStore.storeCurrentConversation.recvMsgOpt === MessageReceiveOptType.NotNotify"
          @updateValue="updateConversationRecvMsgState($event, MessageReceiveOptType.NotNotify)" />
        <SettingRowItem :title="$t('groupPin')" show-switch :loading="switchLoading.pinLoading"
          :checked="conversationStore.storeCurrentConversation.isPinned" @updateValue="updateConversationPinState" />
          <SettingRowItem :title="$t('chatEncryption')" show-switch 
          :checked="true" />
      </div>


      <div class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
        <SettingRowItem :title="$t('groupNickname')" :sub-title="conversationStore.storeCurrentMemberInGroup.nickname"
          @click="toChangeName(false)" />
      </div>

      <div class="bg-white m-[10px] rounded-md overflow-hidden">
        <SettingRowItem :title="$t('popover.clearModalTitle')" @click-item="clearLogs" />
      </div>

      <div class="bg-white m-[10px] rounded-md overflow-hidden flex justify-center align-center">
        <SettingRowItem danger :title="isOwner ? $t('buttons.disbandGroup') : $t('buttons.quitGroup')"
          @click-item="dismissOrQuit" :arrow="false"/>
      </div>

    </div>


    <van-uploader v-show="false" ref="uploaderRef" accept="image/*" capture="camcorder" :preview-image="false"
      :multiple="false" :after-read="afterReadFile" />

    <van-popup v-model:show="showDestructTime" round>
      <div class="px-4 pt-6">
        <div class="mb-1">{{ $t('messageDestruct') }}</div>
        <div class="text-xs text-sub-text">{{ $t('messageDestructToast') }}</div>
      </div>
      <van-picker @change="onChange" :show-toolbar="false" :columns="timeOptions" class="w-full" />
      <div class="flex items-center justify-end px-4 py-2 mb-4">
        <span class="mr-3 cursor-pointer" @click="showDestructTime = false">{{ $t('buttons.cancel') }}</span>
        <span class="cursor-pointer text-primary mr-1" @click="updateDestructDurationTime">{{ $t('buttons.confirm') }}</span>
      </div>
    </van-popup>
  </div>
</template>

<script name="groupSetting" setup lang="ts">
import qr from '@/assets/images/setting/qr.png'
import edit from '@/assets/images/setting/edit.png'
import edit_icon from '@/assets/images/setting/edit_icon.png'
import NavBar from "@/components/NavBar/index.vue";
import Avatar from "@/components/Avatar/index.vue";
import { UploaderFileListItem, UploaderInstance, showConfirmDialog, showLoadingToast } from "vant";
import SettingRowItem from "@/components/SettingRowItem/index.vue";
import GroupMemberRow from "./components/GroupMemberRow.vue";
import {
  MessageReceiveOptType,
} from "@/utils/open-im-sdk-wasm/types/enum";
import useConversationSettings from "@/hooks/useConversationSettings";
import useCurrentMemberRole from "@/hooks/useCurrentMemberRole";
import { IMSDK } from "@/utils/imCommon";
import { v4 as uuidV4 } from "uuid";
import SettingSearch from './components/SettingSearch.vue'
import { feedbackToast } from '@/utils/common';
import useConversationMsgDestruct from '@/hooks/useConversationMsgDestruct';

const {
  conversationStore,
  switchLoading,
  updateConversationPinState,
  updateConversationRecvMsgState,
  clearLogs,
} = useConversationSettings();

const {
  onChange,
  timeOptions,
  destructLoading,
  destructTimeStr,
  showDestructTime,
  updateDestructDuration,
  updateDestructDurationTime,
} = useConversationMsgDestruct()

const { isNomal, isOwner, isAdmin } = useCurrentMemberRole();
const router = useRouter();
const { t } = useI18n()

const uploaderRef = ref<UploaderInstance>()

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileData = Array.isArray(data) ? data[0] : data
  const uploadToast = showLoadingToast({
    message: t('uploading'),
    forbidClick: true,
    duration: 0
  })
  IMSDK.uploadFile({
    name: fileData.file?.name ?? '',
    contentType: fileData.file?.type!,
    uuid: uuidV4(),
    file: fileData.file as File,
  }).then((res) => {
    IMSDK.setGroupInfo({
      groupID: conversationStore.storeCurrentConversation.groupID,
      faceURL: res.data.url
    }).finally(() => uploadToast.close())
  }).catch(() => {
    uploadToast.message = t('messageTip.uploadFailed'); setTimeout(() => {
      uploadToast.close()
    }, 200)
  }).finally(() => uploadToast.close())
}

const chooseAvatar = () => {
  if (!isNomal.value) {
    uploaderRef.value?.chooseFile()
  }
}

const toChangeName = (isGroup?: boolean) => {
  if (isGroup && isNomal.value) {
    return;
  }
  router.push({
    path: 'changeName',
    query: {
      originData: JSON.stringify(isGroup ? conversationStore.storeCurrentGroupInfo : conversationStore.storeCurrentMemberInGroup),
      isGroup
    }
  })
}

const toGroupAnnounce = () => {
  router.push({
    path: 'groupAnnouncement',
    query: {
      isNomal: isNomal.value + ''
    }
  })
}

const toGroupManage = () => {
  router.push('/groupManage')
}

const toGroupQr = () => {
  router.push({
    path: 'selfOrGroupQr',
    query: {
      isGroup: 'true'
    }
  })
}

const dismissOrQuit = () => {
  const funName = isOwner ? 'dismissGroup' : "quitGroup"
  const message = isOwner ? t('messageTip.disbandGroup') : t('messageTip.quitGroup')

  showConfirmDialog({
    message,
    beforeClose: (action: string) => {
      return new Promise((resolve) => {
        if (action !== "confirm") {
          resolve(true);
          return;
        }
        IMSDK[funName](conversationStore.currentConversation.groupID)
          .then(() => router.push('/conversation'))
          .catch((error: unknown) => feedbackToast({ error }))
          .finally(() => resolve(true));
      });
    },
  });
}

</script>

<style lang="scss" scoped></style>
