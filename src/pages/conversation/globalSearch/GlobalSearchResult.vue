<template>
  <div @click="clickItem" class="flex px-4 py-[10px] relative bg-white">
    <div class="flex items-center flex-1 overflow-hidden">
      <Avatar v-if="!isFile" :src="source.faceURL || source.senderFaceUrl"
        :desc="source.nickname || source.showName || source.senderNickname"
        :isGroup="source.groupID !== undefined && !source.senderNickname" :size="42" />
      <img v-else class="w-[38px] h-[44px]" :src="source.faceURL" alt="">
      <div class="flex-1 ml-2 overflow-hidden">
        <div class="flex items-baseline">
          <div class="max-w-[200px] truncate">
            {{ source.nickname || source.groupName || source.showName || source.senderNickname }}
          </div>
          <!-- <text class="truncate ml-2 text-xs text-[#666]">{{source.position}}</text> -->
        </div>
        <div class="truncate max-w-[200px] text-xs text-[#999]">
          <!-- {{source.company || source.latestMsg || messageContent}} -->
          {{ source.latestMsg || messageContent }}
        </div>
      </div>
    </div>
    <div v-if="source.sendTime !== undefined" class="text-xs text-[#adadad]">
      {{ latestTime }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import { formatConversionTime, formatMessageByType } from '@/utils/imCommon';
import Avatar from '@components/Avatar/index.vue'
import { GlobalSearchItem } from './data';
import { MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';
import useContactStore from '@/store/modules/contact';
import useConversationStore from '@/store/modules/conversation';
import { downloadFile } from '@/utils/common';

const emit = defineEmits([]);
const props = defineProps<{ source: GlobalSearchItem, preview?: boolean, conversationName?: string, conversationID?: string, isFile?: boolean }>();

const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore();

const latestTime = formatConversionTime(props.source.sendTime)
const messageContent = props.source.clientMsgID ? formatMessageByType(props.source as unknown as MessageItem) : ''

const clickItem = () => {
  if (props.preview) {
    router.push({
      path: "previewHistoryMessage",
      state: {
        conversationID: props.conversationID,
        conversationName: props.conversationName,
        jumpMessage: JSON.stringify(props.source)
      }
    })
    return;
  }
  if (props.source.userID) {
    contactStore.getUserCardData(props.source.userID)
    return;
  }

  if (props.source.groupName) {
    conversationStore.updateCurrentGroupInfo(props.source)
    router.push({
      path: 'groupCard'
    })
    return;
  }

  if (props.source.fileElem) {
    downloadFile(props.source.fileElem.sourceUrl, props.source.fileElem.fileName)
  }
}

</script>

<style lang='scss' scoped></style>