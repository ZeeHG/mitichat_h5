<template>
  <div class="text-[12px] text-[#999] mt-0.5" :class="{ '!text-[#006AFF]': unReadCount !== 0 }" @click="showDetails">
    {{ readStateStr }}
  </div>
</template>

<script setup lang='ts'>
import { SessionType } from '@/utils/open-im-sdk-wasm/types/enum';
import { ExedMessageItem } from './data';

type MessageReadStateProps = {
  message: ExedMessageItem;
  disabled?: boolean;
}

const props = defineProps<MessageReadStateProps>();

const router = useRouter();
const { t } = useI18n()

const unReadCount = computed(() => {
  if (props.message.sessionType === SessionType.Single) {
    return 0
  }
  return props.message.attachedInfoElem?.groupHasReadInfo.unreadCount ?? 0
})
const readStateStr = computed(() => {
  if (props.message.sessionType === SessionType.Single) {
    return props.message.isRead ? t('readed') : t('unread')
  }
  if (props.message.sessionType !== SessionType.Notification) {
    return unReadCount.value < 1 ? t('allReaded') : t('someUnread', { count: unReadCount.value })
  }
})

const showDetails = () => {
  if (props.disabled || props.message.sessionType === SessionType.Single) {
    return;
  }
  router.push({
    path: 'groupMessageRead',
    state: {
      choosedMessage: JSON.stringify(props.message),
      clientMsgID: props.message.clientMsgID
    },
  })
}

</script>

<style lang='scss' scoped></style>