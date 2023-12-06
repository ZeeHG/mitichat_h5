<template>
  <div>
    <van-loading v-show="message.status === MessageStatus.Sending" size="16" type="spinner" />
    <img class="w-4 h-4 mx-1" v-if="message.status === MessageStatus.Failed" :src="failed" @click="reSend" />
    <span v-if="isPrivateChat" class="text-xs text-[#999] mx-1">{{ `${timerState.count}s` }}</span>
  </div>
</template>

<script setup lang='ts'>
import failed from '@/assets/images/messageItem/failed.png'
import { MessageStatus } from '@/utils/open-im-sdk-wasm/types/enum';
import { ExedMessageItem } from './data';
import useSendMessage from '@/hooks/useSendMessage';
import useMessageStore from '@/store/modules/message';
import { IMSDK } from '@/utils/imCommon';
import { onBeforeRouteLeave } from 'vue-router';
import useConversationStore from '@/store/modules/conversation';

type MessageSendStateProps = {
  message: ExedMessageItem;
}

const props = defineProps<MessageSendStateProps>();

const messageStore = useMessageStore();
const conversationStore = useConversationStore();
const { sendMessage } = useSendMessage();

const timerState = reactive({
  timer: null as NodeJS.Timer | null,
  count: 0
})

const conversationID = conversationStore.currentConversation.conversationID
const isPrivateChat = computed(() => props.message.attachedInfoElem?.isPrivateChat && props.message.isRead)

const reSend = () => {
  messageStore.updateOneMessage({
    ...props.message,
    status: MessageStatus.Sending,
  });
  sendMessage({ message: props.message, needOpreateMessage: false });
}

const timerStart = () => {
  timerState.timer = setInterval(() => {
    if (timerState.count > 0) {
      timerState.count -= 1;
    } else {
      checkPrivateMessage()
    }
  }, 1000)
}

const checkPrivateMessage = () => {
  if (props.message.attachedInfoElem?.isPrivateChat) {
    clearPrivateMessage();
  }
  if (timerState.timer) {
    clearInterval(timerState.timer)
  }
}

const clearPrivateMessage = () => {
  messageStore.deleteOneMessage(props.message)
  IMSDK.deleteMessage({
    conversationID,
    clientMsgID: props.message.clientMsgID
  })
}

watch(isPrivateChat, val => {
  if (val) {
    timerState.count = props.message.attachedInfoElem?.burnDuration ?? 30
    timerStart();
  }
})

onBeforeRouteLeave((to) => {
  if (to.name === 'Conversation' && timerState.count !== 0) {
    checkPrivateMessage();
  }
})

</script>

<style lang='scss' scoped></style>