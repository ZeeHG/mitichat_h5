<template>
  <div class="pl-4 pr-1 flex">
    <Avatar class="mt-4" :src="source.senderFaceUrl" :desc="source.senderNickname" :size="42" />
    <div class=" w-full h-full mx-3 border-b border-[#DFDFDF] py-4 flex-1 overflow-hidden content_item"
      :class="{ '!border-0': noBorder }">
      <div class="flex justify-between">
        <div class="text-[#666] text-xs truncate break-all flex-1">{{ source.senderNickname }}</div>
        <div class="text-xs text-[#999]">{{ messageTime }}</div>
      </div>
      <div class="text-[#333] text-sm line-clamp-2 break-all mt-1">
        <span v-html="parseEmoji(messageContent)"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ExMessageItem } from '@/store/modules/message';
import Avatar from '@/components/Avatar/index.vue';
import { formatMessageByType, parseEmoji } from '@/utils/imCommon';
import dayjs from 'dayjs';


type NomalMessageItemProps = {
  source: ExMessageItem;
  noBorder: boolean
};
const emit = defineEmits([]);
const props = defineProps<NomalMessageItemProps>();

const messageContent = formatMessageByType(props.source)
const messageTime = dayjs(props.source.sendTime).format('M/D HH:mm');

</script>

<style lang='scss' scoped></style>