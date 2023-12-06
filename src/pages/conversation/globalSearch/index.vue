<template>
  <div class="page_container ">
    <div class="flex items-center pl-4 border-b !bg-white">
      <img class="h-[24px] w-[24px]" :src="arrows_left" alt="" @click="onCancel" />
      <van-search class="w-full" v-model="keyword" :placeholder="$t('placeholder.search')" @search="onSearch" />
    </div>

    <van-tabs v-if="!checkedConversation" title-active-color="#1B72EC" v-model:active="active">
      <van-tab :title="$t('comprehensive')">
        <comprehensive-tab
          v-if="[...dataSource.chatLogs, ...dataSource.contacts, ...dataSource.documents, ...dataSource.groups].length > 0"
          :data="dataSource" @toggle-tab="$event => active = $event"
          @check-conversation="$event => checkedConversation = $event" />
        <CommonEmpty v-else :description="$t('emptySearchDesc')" :image="search_null" :size="163" />
      </van-tab>
      <van-tab :title="$t('contactMenu.contacts')">
        <div class="flex-1 overflow-y-auto">
          <div class="m-[10px] rounded-md overflow-hidden" v-if="dataSource.contacts.length > 0">
            <global-search-result v-for="user in dataSource.contacts" :source="(user as any)" :key="user.userID" />
          </div>
          <CommonEmpty v-else :description="$t('emptySearchDesc')" :image="search_null" :size="163" />
        </div>
      </van-tab>
      <van-tab :title="$t('group')">
        <div class="flex-1 overflow-y-auto">
          <div class="m-[10px] rounded-md overflow-hidden" v-if="dataSource.groups.length > 0">
            <global-search-result v-for="group in dataSource.groups" :source="(group as any)" :key="group.groupID" />
          </div>
          <CommonEmpty v-else :description="$t('emptySearchDesc')" :image="search_null" :size="163" />
        </div>
      </van-tab>
      <van-tab :title="$t('chatRecord')">
        <div class="flex-1 overflow-y-auto">
          <div class="m-[10px] rounded-md overflow-hidden" v-if="dataSource.chatLogs.length > 0">
            <global-search-result v-for="log in dataSource.chatLogs" :source="(log as any)" :key="log.conversationID"
              @click="checkedConversation = log" />
          </div>
          <CommonEmpty v-else :description="$t('emptySearchDesc')" :image="search_null" :size="163" />
        </div>
      </van-tab>
      <van-tab :title="$t('documentation')">
        <virtual-list v-if="dataSource.documents.length > 0"
          class="my_scrollbar h-full m-[10px] rounded-md overflow-hidden" :data-key="'clientMsgID'"
          :data-sources="dataSource.documents" :data-component="GlobalSearchResult" :estimate-size="88"
          @tobottom="onBottom" :extra-props="{ isFile: true }" />
        <CommonEmpty v-else />
      </van-tab>
    </van-tabs>
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <div class="flex items-center px-4 py-[10px] m-[10px] mb-0 bg-white rounded-md" @click="clickConversation">
        <Avatar :src="checkedConversation.faceURL" :desc="checkedConversation.showName"
          :isGroup="checkedConversation.groupID !== undefined" :size="42" />
        <div class="flex-1 ml-2 overflow-hidden">
          <div class="flex items-baseline">
            <div class="max-w-[200px] truncate">
              {{ checkedConversation.showName }}
            </div>
          </div>
        </div>
        <img class="w-[24px] h-[24px]" :src="back" alt="">
      </div>
      <virtual-list class="my_scrollbar flex-1 overflow-y-auto m-[10px] rounded-md" :data-key="'clientMsgID'"
        :data-sources="checkedConversation?.messageList" :data-component="GlobalSearchResult" :estimate-size="88"
        :extra-props="{
          preview: true,
          conversationID: checkedConversation?.conversationID,
          conversationName: checkedConversation?.showName
        }" />
    </div>
  </div>
</template>

<script setup lang='ts' name="globalSearch">
import arrows_left from '@/assets/images/chatHeader/arrows_left.png'
import search_null from '@/assets/images/search_null.png'
import back from '@/assets/images/profile/back.png'
import Avatar from '@components/Avatar/index.vue'
import { GlobalDataSource, SearchLocalLogData } from './data';
import { IMSDK, formatMessageByType } from '@/utils/imCommon';
import { MessageType, SessionType } from '@/utils/open-im-sdk-wasm/types/enum';
import ComprehensiveTab from './ComprehensiveTab.vue';
import GlobalSearchResult from './GlobalSearchResult.vue';
import VirtualList from '@components/VirtualList';
import CommonEmpty from '@components/CommonEmpty/index.vue';
import useConversationToggle from "@/hooks/useConversationToggle";
import useUserStore from '@/store/modules/user';
import { fileIcon } from '@/utils/common';

const { toSpecifiedConversation } = useConversationToggle();
const router = useRouter();
const userStore = useUserStore()
const { t } = useI18n()

const keyword = ref()
const active = ref(0)
const dataSource = reactive<GlobalDataSource>({
  contacts: [],
  groups: [],
  chatLogs: [],
  documents: [],
})
const checkedConversation = ref<SearchLocalLogData>()

const fileLogsLoadState = reactive({
  pageIndex: 1,
  hasMore: true,
  loading: false
})

const clickConversation = () => {
  let targetID
  if (checkedConversation.value?.conversationType === SessionType.Single) {
    targetID = checkedConversation.value.messageList[0].recvID === userStore.selfInfo.userID ? checkedConversation.value.messageList[0].sendID : checkedConversation.value.messageList[0].recvID
  } else {
    targetID = checkedConversation.value?.groupID
  }
  toSpecifiedConversation({
    sourceID: targetID as string,
    sessionType: checkedConversation.value?.conversationType as number
  })
}

const onCancel = () => {
  if (checkedConversation.value) {
    checkedConversation.value = undefined
    return;
  }
  router.push('/conversation');
}

const onSearch = () => {
  if (!keyword.value) return;

  fileLogsLoadState.pageIndex = 1;
  fileLogsLoadState.hasMore = true;
  searchUser();
  searchGroup();
  searchChatLogs();
  searchFileLogs();
}

const onBottom = () => {
  if (fileLogsLoadState.hasMore && !fileLogsLoadState.loading) {
    searchFileLogs();
  }
}

const searchUser = () => {
  const options = {
    keywordList: [keyword.value],
    isSearchUserID: true,
    isSearchNickname: true,
    isSearchRemark: true,
  }
  IMSDK.searchFriends(options)
    .then(({ data }: any) => {
      dataSource.contacts = data
    })
}

const searchGroup = () => {
  const options = {
    keywordList: [keyword.value],
    isSearchGroupID: true,
    isSearchGroupName: true,
  }
  IMSDK.searchGroups(options)
    .then(({ data }: any) => {
      dataSource.groups = data
    })
}

const searchChatLogs = () => {
  const options = {
    conversationID: "",
    keywordList: [keyword.value],
    keywordListMatchType: 0,
    senderUserIDList: [],
    messageTypeList: [],
    searchTimePosition: 0,
    searchTimePeriod: 0,
    pageIndex: 0,
    count: 0,
  }
  IMSDK.searchLocalMessages<any>(options)
    .then(({ data }) => {
      const searchData: SearchLocalLogData[] = data.searchResultItems ?? []
      searchData.map(item => {
        item.groupID = item.messageList[0].groupID
        item.sendTime = item.messageList[0].sendTime
        item.latestMsg = item.messageCount > 1 ? t('someChatRecord', { count: item.messageCount }) : formatMessageByType(item.messageList[0])
      })
      dataSource.chatLogs = [...searchData]
    })
}

const searchFileLogs = () => {
  fileLogsLoadState.loading = true;
  const options = {
    conversationID: "",
    keywordList: [keyword.value],
    keywordListMatchType: 0,
    senderUserIDList: [],
    messageTypeList: [MessageType.FileMessage],
    searchTimePosition: 0,
    searchTimePeriod: 0,
    pageIndex: fileLogsLoadState.pageIndex,
    count: 20,
  }
  IMSDK.searchLocalMessages(options)
    .then(({ data }: any) => {
      const searchData = data.searchResultItems ? data.searchResultItems.map((item: any) => item.messageList.map((msg: any) => ({ ...msg, showName: item.showName, faceURL: fileIcon(msg.fileElem.fileType) }))).flat() : [];
      const prevData = fileLogsLoadState.pageIndex === 1 ? [] : dataSource.documents
      dataSource.documents = [...prevData, ...searchData]
      fileLogsLoadState.hasMore = searchData.length === 20
      fileLogsLoadState.pageIndex += 1

      console.error(dataSource.documents)
    })
    .finally(() => fileLogsLoadState.loading = false)
}

</script>

<style lang='scss' scoped>
:deep(.van-search__action) {
  color: #1b78ec;
  margin-left: 10px;
}

.van-tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  :deep(.van-tabs__content) {
    flex: 1;
    overflow: hidden;

    .van-tab__panel {
      overflow-x: auto;
      height: 100%;
    }
  }
}
</style>