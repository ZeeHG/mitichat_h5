<template>
  <div class="page_container !overflow-y-auto">
    <NavBar :title="$t('chatSetting')" />

    <div class="flex items-start bg-white px-4 pt-4 pb-3 mt-2 mx-3 rounded-md overflow-hidden">
      <div class="flex flex-col mr-3">
        <Avatar :size="44" :src="conversationStore.storeCurrentConversation.faceURL"
          :desc="conversationStore.storeCurrentConversation.showName" @click="toUser" />
      </div>
      <img width="44" :src="create_group" alt="" @click="createGroup" />
    </div>

    <SettingSearch />

    <div class="mt-2 mx-3 rounded-md overflow-hidden">
      <SettingRowItem :title="$t('checks.notDisturb')" show-switch :loading="switchLoading.recvMsgLoading"
        :checked="conversationStore.storeCurrentConversation.recvMsgOpt === MessageReceiveOptType.NotNotify"
        @updateValue="updateConversationRecvMsgState($event, MessageReceiveOptType.NotNotify)" />
      <SettingRowItem :title="$t('chatPin')" show-switch :loading="switchLoading.pinLoading"
        :checked="conversationStore.storeCurrentConversation.isPinned" @updateValue="updateConversationPinState" />
    </div>

    <div class="mt-2 mx-3 rounded-md overflow-hidden">
      <SettingRowItem :title="$t('chatPrivate')" show-switch :loading="switchLoading.privateLoading"
        :checked="conversationStore.storeCurrentConversation.isPrivateChat"
        @updateValue="updateConversationPrivateState" />
      <SettingRowItem :title="$t('chatPrivateTime')" v-if="conversationStore.storeCurrentConversation.isPrivateChat"
        :subTitle="burnDurationMap[conversationStore.storeCurrentConversation.burnDuration ?? 30]" @click="show = true" />
    </div>

    <div class="mt-2 mx-3 rounded-md overflow-hidden">
      <SettingRowItem :title="$t('messageDestruct')" show-switch :loading="destructLoading"
        :checked="conversationStore.storeCurrentConversation.isMsgDestruct" @updateValue="updateDestructDuration" />
      <SettingRowItem :title="$t('messageDestructTime')" v-if="conversationStore.storeCurrentConversation.isMsgDestruct"
        :subTitle="destructTimeStr" @click="showDestructTime = true" />
    </div>

    <div class="mt-2 mx-3 rounded-md overflow-hidden">
      <SettingRowItem  :title="$t('popover.clearModalTitle')" @click-item="clearLogs" />
    </div>

    <van-action-sheet v-model:show="show" :onSelect="onSelect" :actions="durationOptions"
      :cancel-text="$t('buttons.cancel')" :description="$t('chatPrivateDesc')" close-on-click-action />

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

<script name="singleSetting" setup lang='ts'>
import create_group from '@assets/images/setting/create_group.png'

import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import SettingRowItem from '@/components/SettingRowItem/index.vue';
import { MessageReceiveOptType } from '@/utils/open-im-sdk-wasm/types/enum';
import useConversationSettings from '@/hooks/useConversationSettings';
import useContactStore from '@/store/modules/contact';
import SettingSearch from '../groupSetting/components/SettingSearch.vue'
import useConversationMsgDestruct from '@/hooks/useConversationMsgDestruct';

const { t } = useI18n()

const durationOptions = [
  { name: `30${t('date.seconds')}`, count: 30 },
  { name: `5${t('date.minutes')}`, count: 60 * 5 },
  { name: `1${t('date.hours')}`, count: 60 * 60 },
  { name: `1${t('date.day')}`, count: 60 * 60 * 24 },
];

const burnDurationMap = durationOptions.reduce((acc, option) => {
  acc[option.count] = option.name;
  return acc;
}, {} as Record<number, string>);

type ActionsType = typeof durationOptions[0]

const show = ref(false);
const router = useRouter()
const contactStore = useContactStore();

const { conversationStore, switchLoading, updateConversationPinState, updateConversationRecvMsgState, updateConversationPrivateState, updateBurnDuration, clearLogs } = useConversationSettings()
const {
  onChange,
  timeOptions,
  destructLoading,
  destructTimeStr,
  showDestructTime,
  updateDestructDuration,
  updateDestructDurationTime
} = useConversationMsgDestruct()

const onSelect = (item: ActionsType) => {
  updateBurnDuration(item.count)
};

const toUser = () => {
  contactStore.getUserCardData(conversationStore.storeCurrentConversation.userID)
}

const createGroup = () => {
  router.push({
    path: 'createGroup',
    state: {
      prevCheckedUserList: JSON.stringify([{
        ...conversationStore.storeCurrentConversation,
        nickname: conversationStore.storeCurrentConversation.showName
      }]),
    }
  })
}

</script>

<style lang='scss' scoped></style>