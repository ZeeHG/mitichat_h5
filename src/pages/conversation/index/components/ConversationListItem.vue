<template>
  <van-swipe-cell>
    <div @click="clickConversation"
      class="flex items-center py-[8px] mb-2 ml-[12px] px-[10px] rounded-l-[34px] bg-white">
      <div class="pinned" v-if="source.isPinned"></div>
      <Avatar :size="54" :src="source.faceURL" :desc="source.showName" :is-group="isGroup"
        :is-notification="isNotification" />

      <div class="mx-3 flex justify-between flex-col flex-1">
        <div class="flex-1 flex justify-between items-center">
          <div class="text-[18px] truncate max-w-[40vw]">{{ source.showName }}</div>
          <span class="w-max text-[12px] text-[#999]">{{ latestMessageTime }}</span>
        </div>
        <div class="flex-1 flex text-[14px] text-[#999] items-center"
          :class="{ 'justify-between': notAccept || source.unreadCount > 0 }">
          <div class="truncate max-w-[65vw]">
            <span v-show="messagePrefix" class="mr-1"
              :class="{ 'text-[#8443F8]': activePrefix }">{{ messagePrefix}}</span>
            <span v-html="parseEmoji(formattedMessage)"></span>
          </div>
          <img v-if="notAccept" class="w-4 h-4" :src="not_accept" alt="">
          <van-badge v-else class="w-fit" color="#F44038" :content="source.unreadCount" max="99" :show-zero="false" />
        </div>
      </div>
    </div>
    <template #right>
      <van-button color="#8443F8" :text="$t(!source.isPinned ? 'buttons.pin' : 'buttons.cancelPin')"
        @click="updatePin" />
      <van-button color="#FF381F" :text="$t('buttons.remove')" @click="removeConversation" />
      <van-button v-if="source.unreadCount > 0" color="#8E9AB0" :text="$t('buttons.markAsRead')" @click="markHasRead" />
    </template>
  </van-swipe-cell>
</template>

<script setup lang='ts'>
import { ConversationItem, MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';
import Avatar from '@/components/Avatar/index.vue';
import not_accept from '@assets/images/conversation/not_accept.png'
import { formatConversionTime, IMSDK, getConversationContent, parseEmoji } from '@/utils/imCommon';
import { GroupAtType, MessageReceiveOptType, SessionType } from '@/utils/open-im-sdk-wasm/types/enum';
import { feedbackToast } from '@/utils/common';
import useConversationStore from '@/store/modules/conversation';
import { GroupSessionTypes } from '@/constants/enum';


type ConversationItemProps = {
  source: ConversationItem
}

const router = useRouter();
const { t } = useI18n();

const conversationStore = useConversationStore();

const emit = defineEmits([]);
const props = defineProps<ConversationItemProps>();

const isGroup = GroupSessionTypes.includes(props.source.conversationType)
const isNotification = props.source.conversationType === SessionType.Notification

const notAccept = props.source.recvMsgOpt !== MessageReceiveOptType.Nomal

const formattedMessage = computed(() => {
  let parsedMessage: MessageItem | undefined = undefined
  try {
    parsedMessage = JSON.parse(props.source.latestMsg);
  } catch (e) { }
  if (!parsedMessage) return ''
  return getConversationContent(parsedMessage)
})

const latestMessageTime = computed(() => formatConversionTime(props.source.latestMsgSendTime))

const messagePrefix = computed(() => {
  if (props.source.draftText) {
    let text = props.source.draftText;
    return t('messageDesc.drftMessage')
  }
  let prefix = ''

  if (props.source?.recvMsgOpt !== MessageReceiveOptType.Nomal && props.source.unreadCount > 0) {
    prefix = t('pieces', { number: props.source.unreadCount });
  }

  if (props.source.groupAtType !== GroupAtType.AtNormal) {
    switch (props.source.groupAtType) {
      case GroupAtType.AtAll:
        prefix = t('messageDesc.atAll')
        break;
      case GroupAtType.AtMe:
        prefix = t('messageDesc.atYou')
        break;
      case GroupAtType.AtAllAtMe:
        prefix = t('messageDesc.atYou')
        break;
      case GroupAtType.AtGroupNotice:
        prefix = t('messageDesc.groupAnnouncement')
        break;
    }
  }

  return prefix
})

const activePrefix = computed(() => props.source.groupAtType !== GroupAtType.AtNormal)

const clickConversation = () => {
  conversationStore.updateCurrentConversation(props.source);
  let path = 'myChat'
  if (props.source.conversationType === SessionType.Notification) {
    path = 'notifyMessageList'
  }
  router.push(path)
}

const updatePin = () => {
  IMSDK.pinConversation({
    conversationID: props.source.conversationID,
    isPinned: !props.source.isPinned
  })
    .catch((error) => feedbackToast({ error }))
}
const removeConversation = () => {
  IMSDK.deleteConversationAndDeleteAllMsg(props.source.conversationID)
    .then(() => conversationStore.delConversationByCID(props.source.conversationID))
    .catch((error) => feedbackToast({ error }))
}
const markHasRead = () => {
  IMSDK.markConversationMessageAsRead(props.source.conversationID)
    .catch((error) => feedbackToast({ error }))
}

</script>

<style lang='scss' scoped>
.pinned {
  position: absolute;
  top: 4px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-image: linear-gradient(to bottom left, #8443F8 50%, white 50%);
}

:deep(.van-button) {
  height: 100%;
  max-width: 70px;
  border-radius: 0;
}

:deep(.van-badge--top-right) {
  transform: translate(0, 0);
}
</style>