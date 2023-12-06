<template>
  <div class="flex h-[92px] py-3 bg-[#F0F2F6]">
    <div @click="mutipleForward" class="flex flex-col justify-center items-center flex-1 px-6 text-xs text-[#898989]">
      <img :src="forward" width="48" alt="forward">
      <text class="mt-1.5">
        {{ $t('forward') }}
      </text>
    </div>
    <div @click="mutipleRemove" class="flex flex-col justify-center items-center flex-1 px-6 text-xs text-[#898989]">
      <img :src="delete_btn" width="48" alt="delete">
      <text class="text-error-text mt-1.5">
        {{ $t('messageMenu.delete') }}
      </text>
    </div>
  </div>
</template>

<script setup lang='ts'>
import delete_btn from '@/assets/images/chatFooter/delete.png';
import forward from '@/assets/images/chatFooter/forward.png';

import { ContactChooseEnum } from '@/pages/contact/chooseUser/data';
import useConversationStore from '@/store/modules/conversation';
import useMessageStore from '@/store/modules/message';
import { feedbackToast } from '@/utils/common';
import { formatMessageByType, IMSDK } from '@/utils/imCommon';

const { t } = useI18n();
const router = useRouter();
const messageStore = useMessageStore();
const conversationStore = useConversationStore();

const mutipleRemove = () => {
  const messageList = messageStore.storeHistoryMessageList.filter(message => message.checked)
  const promiseList = messageList.map(async message => IMSDK.deleteMessage({
    conversationID: conversationStore.currentConversation.conversationID,
    clientMsgID: message.clientMsgID
  }))
  Promise.all(promiseList).then(() => {
    messageList.map(message => messageStore.deleteOneMessage(message))
    router.back();
    feedbackToast({
      message: t('messageTip.deleteSuccess'),
    })
  })
}

const mutipleForward = () => {
  const messageList = messageStore.storeHistoryMessageList.filter(message => message.checked)
  const name = conversationStore.storeCurrentConversation.showName
  const mergeData = {
    messageList,
    title: conversationStore.storeCurrentConversation.userID ? t('singleMerge', { name }) : t('groupMerge', { name }),
    summaryList: messageList.map(message => `${message.senderNickname}：${formatMessageByType(message)}`)
  }
  console.log(mergeData);

  router.push({
    path: 'chooseUser',
    state: {
      chooseType: ContactChooseEnum.MergeMessage,
      extraData: JSON.stringify(mergeData)
    }
  })
}
</script>

<style lang='scss' scoped></style>