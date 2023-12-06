<template>
  <div class="message_quote_wrap">
    <div class="message_quote_text line-clamp-3" @click="jump2Message">
      <span v-html="showContent"></span>
      <span v-if="isCardMessage" class="mr-1.5">{{ messageData.cardElem.nickname }}</span>
      <div class="message_quote_media" @click="clickMediaItem">
        <img v-if="isImageMessage" :src="messageData.pictureElem.snapshotPicture.url"
          class="max-w-[32px] max-h-[32px] rounded-md ml-1.5" alt="img">
        <img v-if="isFileMessage" :src="zip" class="max-w-[32px] ml-1.5 max-h-[32px] rounded-md" alt="img">
        <img v-if="isLocationMessage" :src="location" class="max-w-[32px] ml-1.5 max-h-[32px] rounded-md" alt="img">
        <Avatar v-if="isCardMessage" :src="messageData.cardElem.faceURL" :desc="messageData.cardElem.nickname" :size="32"
          :is-group="false" />
        <img v-if="isVideoMessage" class="play_icon ml-1.5" :src="play_icon" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import play_icon from '@/assets/images/chating_message_video_play.png'
import zip from '@/assets/images/messageItem/zip.png'
import location from '@/assets/images/messageItem/location.png'
import { formatMessageByType, parseBr, parseEmoji } from '@/utils/imCommon';
import { MessageType } from '@/utils/open-im-sdk-wasm/types/enum';
import { showImagePreview } from 'vant';
import { ExedMessageItem } from './data';
import emitter from "@/utils/events";
import Avatar from '@/components/Avatar/index.vue'
import { downloadFile } from '@/utils/common';

type QuoteMessageRendererProps = {
  message: ExedMessageItem;
}

const props = defineProps<QuoteMessageRendererProps>();

const { t } = useI18n()
const router = useRouter()

const isAtMessage = props.message.contentType === MessageType.AtTextMessage
const messageData = isAtMessage ? props.message.atTextElem.quoteMessage as unknown as ExedMessageItem : props.message.quoteElem.quoteMessage
const isImageMessage = messageData.contentType === MessageType.PictureMessage
const isVideoMessage = messageData.contentType === MessageType.VideoMessage
const isFileMessage = messageData.contentType === MessageType.FileMessage;
const isLocationMessage = messageData.contentType === MessageType.LocationMessage;
const isCardMessage = messageData.contentType === MessageType.CardMessage;

const replyContent = computed(() => {
  if (isVideoMessage || isImageMessage) {
    return ''
  }
  if (isAtMessage && props.message.atTextElem.quoteMessage?.contentType === MessageType.RevokeMessage) {
    return t('messageDesc.quoteRevokeMessage');
  }
  if (!isAtMessage && props.message.quoteElem.quoteMessage?.contentType === MessageType.RevokeMessage) {
    return t('messageDesc.quoteRevokeMessage');
  }
  return parseBr(formatMessageByType(messageData))
})

const showContent = computed(() => `${messageData.senderNickname}: ${parseEmoji(replyContent.value)}`)

const clickMediaItem = () => {
  if (isVideoMessage) {
    router.push({
      path: '/previewVideo',
      query: {
        url: messageData.videoElem.videoUrl,
        poster: messageData.videoElem.snapshotUrl
      }
    })
  }
  if (isImageMessage) {
    showImagePreview({
      images: [messageData.pictureElem.sourcePicture.url],
      startPosition: 0,
      closeable: true,
    })
  }
  if (isFileMessage) {
    downloadFile(messageData.fileElem.sourceUrl, messageData.fileElem.fileName)
  }
}

const jump2Message = () => {
  emitter.emit("CHAT_MAIN_SCROLL_TO_CLIENTMSGID", props.message.quoteElem.quoteMessage.clientMsgID)
}

</script>

<style lang='scss' scoped>
.message_quote_wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;

  .message_quote_text {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 10px;
    color: #666;
    font-size: 12px;
    border-radius: 4px;
    background-color: #F4F5F7;

    :deep(.emoji_el) {
      padding-right: 2px;
      vertical-align: sub;
      width: 24px;
    }
  }

  .message_quote_media {
    max-height: 32px;
    position: relative;

    .play_icon {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>