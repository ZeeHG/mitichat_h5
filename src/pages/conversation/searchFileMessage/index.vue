<template>
  <div class="page_container">
    <NavBar class="shadow-md" :title="$t('document')" />
    <div class="flex-1 overflow-y-auto border-t">
      <virtual-list v-if="searchResult.length > 0" class="my_scrollbar h-full rounded-md overflow-hidden"
        :data-key="'clientMsgID'" :data-sources="searchResult" :data-component="GlobalSearchResult" :estimate-size="88"
        @tobottom="loadData" :extra-props="{ isFile: true }" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import VirtualList from '@components/VirtualList';
import NavBar from '@/components/NavBar/index.vue';
import useConversationStore from '@/store/modules/conversation';
import { IMSDK } from '@/utils/imCommon';
import { MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { MessageType } from '@/utils/open-im-sdk-wasm/types/enum';
import GlobalSearchResult from '../globalSearch/GlobalSearchResult.vue'
import { fileIcon } from '@/utils/common';

const conversationStore = useConversationStore();

const searchResult = ref<MessageItem[]>([])
const loadState = reactive({
  loading: false,
  hasMore: true,
  pageIndex: 1,
  count: 50
})

const loadData = () => {
  const options = {
    conversationID: conversationStore.storeCurrentConversation.conversationID,
    keywordList: [],
    keywordListMatchType: 0,
    senderUserIDList: [],
    messageTypeList: [MessageType.FileMessage],
    searchTimePosition: 0,
    searchTimePeriod: 0,
    pageIndex: loadState.pageIndex,
    count: loadState.count,
  };

  IMSDK.searchLocalMessages<any>(options)
    .then(({ data }) => {
      if (loadState.hasMore) {
        const searchData = data.searchResultItems ? data.searchResultItems.map((item: any) => item.messageList.map((msg: any) => ({ ...msg, showName: item.showName, faceURL: fileIcon(msg.fileElem.fileType) }))).flat() : [];
        console.error(searchData)
        searchResult.value = searchData
        loadState.pageIndex += 1;
        loadState.hasMore = searchData.length === 50
      }
    })
}

onBeforeMount(() => {
  loadData()
})

</script>

<style lang='scss' scoped></style>