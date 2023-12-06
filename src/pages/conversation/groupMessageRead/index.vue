<template>
  <div class="page_container">
    <NavBar :title='$t("messageRecipientList")' />
    <van-tabs v-model:active="active">
      <van-tab :title="`${$t('readed')} ${readedCount}`">
        <virtual-list v-if="loadState.readedMemberList.length > 0"
          class="my_scrollbar h-full overflow-y-auto bg-[#F8F9FA]" data-key="userID"
          :data-sources="loadState.readedMemberList" :data-component="GenericListItem" :estimate-size="88"
          :extra-props="{
            total: loadState.readedMemberList.length
          }" @tobottom="readedScrolltolower" />
        <CommonEmpty v-else />
      </van-tab>
      <van-tab :title="`${$t('unread')} ${unReadCount}`">
        <virtual-list v-if="loadState.unReadMemberList.length > 0"
          class="my_scrollbar h-full overflow-y-auto bg-[#F8F9FA]" data-key="userID"
          :data-sources="loadState.unReadMemberList" :data-component="GenericListItem" :estimate-size="88"
          :extra-props="{
            total: loadState.unReadMemberList.length
          }" @tobottom="unreadScrolltolower" />
        <CommonEmpty v-else />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang='ts'>
import useConversationStore from '@/store/modules/conversation';
import { IMSDK } from '@/utils/imCommon';
import GenericListItem from '@/components/GenericListItem/index.vue';
import VirtualList from '@components/VirtualList';
import { GroupMemberItem, MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';

const conversationStore = useConversationStore();

const active = ref(0)
const loadState = reactive({
  readedHasMore: true,
  readedLoading: false,
  readedMemberList: [] as GroupMemberItem[],
  unReadHasMore: true,
  unReadLoading: false,
  unReadMemberList: [] as GroupMemberItem[]
})
const choosedMessage: MessageItem = JSON.parse(history.state.choosedMessage)
const clientMsgID = history.state.clientMsgID
const readedCount = choosedMessage.attachedInfoElem?.groupHasReadInfo.hasReadCount
const unReadCount = choosedMessage.attachedInfoElem?.groupHasReadInfo.unreadCount

const readedScrolltolower = () => {
  if (loadState.readedHasMore && !loadState.readedLoading) {
    getReadedMemberList()
  }
}

const unreadScrolltolower = () => {
  if (loadState.unReadHasMore && !loadState.unReadLoading) {
    getUnreadMemberList()
  }
}

const getReadedMemberList = () => {
  loadState.readedLoading = true
  IMSDK.getGroupMessageReaderList<GroupMemberItem[]>({
    conversationID: conversationStore.storeCurrentConversation.conversationID,
    clientMsgID,
    filter: 0,
    offset: loadState.readedMemberList.length,
    count: 20,
  }).then(({
    data
  }) => {
    loadState.readedMemberList = [...loadState.readedMemberList, ...data]
    loadState.readedHasMore = data.length === 20
  }).finally(() => loadState.readedLoading = false)
}

const getUnreadMemberList = () => {
  loadState.unReadLoading = true
  IMSDK.getGroupMessageReaderList<GroupMemberItem[]>({
    conversationID: conversationStore.storeCurrentConversation.conversationID,
    clientMsgID,
    filter: 1,
    offset: loadState.unReadMemberList.length,
    count: 20,
  }).then(({
    data
  }) => {
    loadState.unReadMemberList = [...loadState.unReadMemberList, ...data]
    loadState.unReadHasMore = data.length === 20
  }).finally(() => loadState.unReadLoading = false)
}

onMounted(() => {
  getUnreadMemberList();
  getReadedMemberList();
})

</script>

<style lang='scss' scoped>
.van-tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  :deep(.van-tabs__content) {
    flex: 1;
    background: #F8F9FA;
    overflow: hidden;
    border-top: 1px solid #E8EAEF;

    .van-tab__panel {
      height: 100%;
    }
  }
}
</style>