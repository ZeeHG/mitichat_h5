<template>
  <div>
    <div id="chat_footer" class="flex items-center px-3 py-3 bg-[#F0F2F6]">
      <img @click="toggleRecording" class="h-[26px] min-w-[26px] mr-3" :src="recording ? keyboard : audio" alt="">
      <div class="flex-grow">
        <div v-show="recording" ref="recordingBtnRef" @touchmove="touchMoveSpeech" @touchend="endRecord"
          class="bg-[#8E9AB0] bg-opacity-30 text-[#fff] flex justify-center items-center h-8 rounded">
          <span class="select-none">{{ $t('buttons.holdSpeak') }}</span>
        </div>
        <CustomEdit v-show="!recording" class="bg-[#fff]" ref="inputRef" @change="inputChange"
          @focus="onFocusUpdate(true)" @blur="onFocusUpdate(false)" v-model:input="messageContent"
          :placeholder="inputPlaceholder" @trigger-at="tryToAtPage" />
        <div v-if="quoteMessage"
          class="bg-white text-xs text-[#666] mt-1 pl-1 pr-5 py-1 rounded line-clamp-2 break-all relative">
          <span v-html="parseEmoji(quoteMessage)"></span>
          <img class="absolute right-1 top-1" width="16" :src="quote_close" alt="" @click="clearQuoteMessage" />
        </div>
      </div>
      <img @click="clickEmojiBtn" class="h-[26px] min-w-[26px] ml-3" :src="emoji" alt="">
      <img v-show="!messageContent" @click="clickAddBtn" class="h-[26px] min-w-[26px] ml-3" :src="add" alt="">
      <img v-show="messageContent" @click="switchTextMessage" class="h-[26px] min-w-[26px] ml-3" :src="send" alt="send">
    </div>
    <ChatFooterAction v-show="showActionBar" @closeActionBar="closeActionBar" @getFile="getFile" />
    <ChatFooterEmoji v-show="showEmojiBar" @closeEmojiBar="closeEmojiBar" @emojiClick="emojiClick" />
    <ChatFooterRecording ref="recordingOverlayRef" @recordFinish="recordFinish" />
    <ChatFooterAtPop v-if="showAtPop" @cancel="showAtPop = false" @finish="clickAtItemHandler" />
  </div>
</template>

<script setup lang='ts'>
import add from '@/assets/images/chatFooter/add.png'
import audio from '@/assets/images/chatFooter/audio.png'
import emoji from '@/assets/images/chatFooter/emoji.png'
import keyboard from '@/assets/images/chatFooter/keyboard.png'
import quote_close from '@/assets/images/chatFooter/quote_close.png'
import send from '@/assets/images/chatFooter/send.png'

import CustomEdit from '@/components/CustomEdit/index.vue';
import ChatFooterAction from './ChatFooterAction.vue';
import ChatFooterEmoji from './ChatFooterEmoji.vue';
import ChatFooterRecording from './ChatFooterRecording.vue';
import { onLongPress, useThrottleFn } from '@vueuse/core';
import { GroupMemberItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { MessageType, SessionType } from '@/utils/open-im-sdk-wasm/types/enum'
import { showToast, UploaderFileListItem } from 'vant';
import useSendMessage from '@/hooks/useSendMessage';
import useConversationStore from '@/store/modules/conversation';
import { formatMessageByType, IMSDK, parseEmoji } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';
import emitter from "@/utils/events";
import { checkIsSafari } from '@/utils/common';
import useCreateNomalMessage from './useCreateNomalMessage'
import useCreateFileMessage from './useCreateFileMessage'
import ChatFooterAtPop from './ChatFooterAtPop.vue'

const emit = defineEmits([]);
defineProps();

const { t } = useI18n()
const conversationStore = useConversationStore();

// message
const messageContent = ref('')
const inputPlaceholder = ref(t('placeholder.pleaseInput'))
const inputRef = ref();

const { createFileMessage } = useCreateFileMessage()

const { getAtList, switchNomalMessage } = useCreateNomalMessage({
  messageContent,
});
const { sendMessage } = useSendMessage();

const quoteMessage = computed(() => conversationStore.storeQuoteMessage ? `${t('messageMenu.replay')}：${formatMessageByType(conversationStore.storeQuoteMessage)}` : null)

const clearQuoteMessage = () => {
  conversationStore.updateQuoteMessage();
}

const showAtPop = ref(false)

const tryToAtPage = () => {
  if (conversationStore.storeCurrentConversation.groupID) {
    showAtPop.value = true
  }
}

const clickAtItemHandler = ({ data, needDelete }: { data: GroupMemberItem[], needDelete: boolean }) => {
  if (needDelete) {
    inputRef.value.deletePreviousChar();
  }
  const nodes = [] as Node[]
  data.map(member => {
    const oldList = getAtList();
    if (oldList.find(item => item.userID === member.userID)) {
      return;
    }
    const b = document.createElement("b");
    b.textContent = `@${member.nickname} `;
    b.setAttribute("class", "at_el");
    b.setAttribute("data_id", member.userID);
    b.setAttribute("data_name", member.nickname);
    b.setAttribute("contenteditable", "false");
    nodes.push(b)
    nodes.push(document.createTextNode("\u200B"))
  })
  inputRef.value.insertAtCursor(nodes);
  showAtPop.value = false
}

const inputChange = useThrottleFn(() => {
  if (conversationStore.storeCurrentConversation.conversationType !== SessionType.Single) {
    return;
  }
  IMSDK.typingStatusUpdate({ recvID: conversationStore.storeCurrentConversation.userID, msgTip: 'yes' })
}, 2000)

const onFocusUpdate = (isFocus: boolean) => {
  if (!checkIsSafari()) {
    return;
  }
  setTimeout(() => emitter.emit("KEYBOARD_UPDATE"), 100)
  if (isFocus) {
    setTimeout(() => window.scroll(0, 0), 101)
  }
}

const switchTextMessage = async () => {
  const message = await switchNomalMessage();
  if (message) {
    sendMessage({ message })
  }
  resetState();
}

const emojiClick = (str: string) => {
  const imgStr = parseEmoji(str);
  const parser = new DOMParser();
  const doc = parser.parseFromString(imgStr, "text/html");
  const nodes = Array.from(doc.body.childNodes);
  inputRef.value.insertAtCursor(nodes)
};

const resetState = () => {
  messageContent.value = "";
  conversationStore.updateQuoteMessage();
  inputRef.value.clear();
};

// recording
const recording = ref(false)
const recordingBtnRef = ref()
const recordingOverlayRef = ref()

const onMenuLongPressCall = () => {
  recordingOverlayRef.value.isShowOverlay();
}

onLongPress(
  recordingBtnRef,
  onMenuLongPressCall,
  { modifiers: { prevent: true } }
)

const toggleRecording = async () => {
  if (!recording.value) {
    try {
      await recordingOverlayRef.value.requestPermission()
    } catch (error) {
      console.log(error);
      showToast(t('messageTip.environmentNotSupported'))
      return;
    }
  }
  recording.value = !recording.value
}

const touchMoveSpeech = useThrottleFn((event: TouchEvent) => {
  recordingOverlayRef.value.touchMoveSpeech(event);
}, 250)

const endRecord = () => {
  recordingOverlayRef.value.isShowOverlay(false);
}

const recordFinish = async (blob: File, duration: number) => {
  const { error, message, buffer } = await createFileMessage(blob, MessageType.VoiceMessage, duration)
  if (error || !message) {
    feedbackToast({ error, message: error })
    return;
  }
  sendMessage({ message, fileArrayBuffer: buffer as ArrayBuffer })
}

// action bar
const showActionBar = ref(false)
const showEmojiBar = ref(false)

const closeActionBar = () => {
  showActionBar.value = false
}
const closeEmojiBar = () => {
  showEmojiBar.value = false
}
const clickAddBtn = () => {
  if (showEmojiBar.value) {
    showEmojiBar.value = false
  }
  showActionBar.value = !showActionBar.value
}
const clickEmojiBtn = () => {
  if (showActionBar.value) {
    showActionBar.value = false
  }
  showEmojiBar.value = !showEmojiBar.value
}
const getFile = async (uploadData: UploaderFileListItem) => {
  let messageType = MessageType.FileMessage
  if (uploadData.file?.type.includes('image')) {
    messageType = MessageType.PictureMessage
  }
  if (uploadData.file?.type.includes('video')) {
    messageType = MessageType.VideoMessage
  }
  const { error, message, buffer, snapBuffer } = await createFileMessage(uploadData.file!, messageType)
  if (error || !message) {
    feedbackToast({ error, message: error })
    return;
  }
  sendMessage({ message, fileArrayBuffer: buffer as ArrayBuffer, snpFileArrayBuffer: snapBuffer as ArrayBuffer })
}

watch(() => conversationStore.storeQuoteMessage, (val) => {
  if (val) {
    inputRef.value.inputRef.focus()
  }
})

onMounted(() => {
  inputRef.value.inputRef.focus()
  emitter.on("AT_SOMEONE", clickAtItemHandler)
})

onUnmounted(() => {
  emitter.off("AT_SOMEONE", clickAtItemHandler)
})

</script>

<style lang='scss' scoped>
:deep(.van-button__content) {
  width: max-content;
}
</style>