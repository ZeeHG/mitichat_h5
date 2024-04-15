<template>
  <div class="page_container !bg-white">
    <div class="flex items-center pl-4 border-b">
      <img class="h-[24px] w-[24px]" :src="arrows_left" alt="" @click="onCancel" />
      <van-search v-model="keyword" :show-action="false" :placeholder="$t('placeholder.search')" @clear="onClear"
        @search="onSearch" @update:model-value="onUpdate" class="w-full" />
    </div>

    <div class="mt-10" v-show="!searching">
      <div class="text-center text-sub-text text-sm mb-5">{{ $t('findingChatHistory') }}</div>
      <div class="flex justify-between px-[15vw] text-primary text-sm">
        <span @click="toMedia(false)">{{ $t('picture') }}</span>
        <span @click="toMedia(true)">{{ $t('video') }}</span> 
        <span @click="toFile">{{ $t('documnet') }}</span>
      </div>
    </div>
    <div class="mt-20 flex justify-center items-center flex-col"
      v-if="searching && searchResult.length === 0 && !loadState.loading">
      <img class="w-[125px] h-[76px] mb-6" :src="search_empty" alt="">
      <span class="text-sub-text">{{ $t('noRelevantContent', { keyword }) }}</span>
    </div>

    <div class="mt-3 text-center" v-show="loadState.loading">
      <van-loading>{{ $t('searching') }}</van-loading>
    </div>

    <virtual-list v-show="searchResult.length > 0 && !loadState.loading" ref="vsl"
      class="my_scrollbar flex-1 overflow-y-auto !flex-col" :data-key="'clientMsgID'" :data-sources="searchResult"
      :bottomThreshold="160" :data-component="NomalMessageItem" :estimate-size="88" :extra-props="(message: MessageItem) => ({
        onClick: () => clickMessage(message)
      })" @onBottom="onToBottom">
    </virtual-list>
  </div>
</template>

<script setup lang='ts'>
import arrows_left from '@/assets/images/chatHeader/arrows_left.png'
import search_empty from '@/assets/images/search_empty.png'
import VirtualList from '@components/VirtualList';
import NomalMessageItem from "@/pages/conversation/previewMergeMessage/NomalMessageItem.vue";
import { IMSDK } from '@/utils/imCommon';
import useConversationStore from '@/store/modules/conversation';
import { MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { feedbackToast } from '@/utils/common';
import { MessageInfo } from '@/types/search';

const conversationStore = useConversationStore();
const router = useRouter();
const { t } = useI18n()

const keyword = ref()
const searching = ref(false)
const searchResult = ref([] as MessageItem[])
const loadState = reactive({
  loading: false,
  hasMore: true,
  pageIndex: 1,
  count: 20
})

const onClear = () => {
  searching.value = false
}

const onUpdate = (value: string) => {
  if (!value) {
    searching.value = false
  }
}

const onSearch = () => {
  console.log('onSearch');
  searching.value = true
  loadState.pageIndex = 1
  loadState.loading = true
  const options = {
    conversationID: conversationStore.storeCurrentConversation.conversationID,
    keywordList: [keyword.value],
    keywordListMatchType: 0,
    senderUserIDList: [],
    messageTypeList: [],
    searchTimePosition: 0,
    searchTimePeriod: 0,
    pageIndex: loadState.pageIndex,
    count: loadState.count,
  };
  IMSDK.searchLocalMessages<MessageInfo>(options)
    .then(({ data }) => {
      const searchData = data.searchResultItems ? data.searchResultItems[0].messageList : [];
      if (loadState.pageIndex === 1) {
        searchResult.value = [...searchData]
      } else {
        searchResult.value = [...searchResult.value, ...searchData]
      }
      console.log(searchResult.value);
      loadState.pageIndex += 1;
      loadState.hasMore = searchData.length === loadState.count
    })
    .catch(error => feedbackToast({ message: t('messageTip.searchFailed'), error }))
    .finally(() => loadState.loading = false)
}

const onCancel = () => {
  router.back();
}

const onToBottom = () => {

}

const toMedia = (isVideo?: boolean) => {
  router.push({
    path: 'searchMediaMessage',
    query: {
      isVideo: isVideo + ''
    }
  })
}

const toFile = () => {
  router.push('searchFileMessage')
}

const clickMessage = (message: MessageItem) => {
  router.push({
    path: "previewHistoryMessage",
    state: {
      conversationID: conversationStore.storeCurrentConversation.conversationID,
      conversationName: conversationStore.storeCurrentConversation.showName,
      jumpMessage: JSON.stringify(message)
    }
  })
}

</script>

<style lang='scss' scoped>
:deep(.van-search__content) {
  background-color: #f2f2f2;
}

:deep(.van-search__action) {
  color: #1B72EC;
}

:deep(.content_item) {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>