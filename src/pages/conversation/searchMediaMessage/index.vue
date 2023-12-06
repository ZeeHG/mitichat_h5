<template>
  <div class="page_container !bg-white">
    <NavBar class="shadow-md" :title="isVideo ? $t('video') : $t('picture')" />
    <div class="flex-1 overflow-y-auto bg-white border-t">
      <MediaMessageRow v-if="searchResult.week.length > 0" :title="$t('date.thisWeek')" :imgs="searchResult.imgs"
        :messages="searchResult.week" :is-video="isVideo" />
      <MediaMessageRow v-if="searchResult.month.length > 0" :title="$t('date.thisMonth')" :imgs="searchResult.imgs"
        :messages="searchResult.month" :is-video="isVideo" />
      <MediaMessageRow v-if="searchResult.before.length > 0" :title="$t('date.earlier')" :imgs="searchResult.imgs"
        :messages="searchResult.before" :is-video="isVideo" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import useConversationStore from '@/store/modules/conversation';
import { IMSDK } from '@/utils/imCommon';
import dayjs from 'dayjs';
import { MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { MessageType } from '@/utils/open-im-sdk-wasm/types/enum';
import MediaMessageRow from './MediaMessageRow.vue';
import { MessageInfo } from '@/types/search';

const conversationStore = useConversationStore();
const props = defineProps<{ isVideo: boolean }>()

const searchResult = ref({
  week: [] as MessageItem[],
  month: [] as MessageItem[],
  before: [] as MessageItem[],
  imgs: [] as string[]
})
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
    messageTypeList: [props.isVideo ? MessageType.VideoMessage : MessageType.PictureMessage],
    searchTimePosition: 0,
    searchTimePeriod: 0,
    pageIndex: loadState.pageIndex,
    count: loadState.count,
  };

  IMSDK.searchLocalMessages<MessageInfo>(options)
    .then(({ data }) => {
      const searchData: MessageItem[] = data.searchResultItems ? data.searchResultItems[0].messageList : [];
      let weekMessage: MessageItem[] = [];
      let monthMessage: MessageItem[] = [];
      let beforeMessage: MessageItem[] = [];
      searchData.map(message => {
        const time = message.sendTime;
        if (time > dayjs().subtract(1, 'week').unix()) {
          weekMessage.push(message)
        } else if (time > dayjs().subtract(1, 'month').unix()) {
          monthMessage.push(message)
        } else {
          beforeMessage.push(message)
        }
      })
      searchResult.value = {
        week: [...searchResult.value.week, ...weekMessage],
        month: [...searchResult.value.month, ...monthMessage],
        before: [...searchResult.value.before, ...beforeMessage],
        imgs: props.isVideo ? [] : searchData.map(message => message.pictureElem.sourcePicture.url)
      }
      console.log(searchResult.value);
      loadState.pageIndex += 1;
      loadState.hasMore = searchData.length === 50
    })
}

onBeforeMount(() => {
  loadData()
})

</script>

<style lang='scss' scoped></style>