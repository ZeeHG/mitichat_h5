<template>
  <van-popup v-model:show="showAtPop" position="bottom" round @click-overlay="showAtPop = false" @closed="closed"
    class="!bg-[#F8F9FA]">
    <div class="h-screen flex flex-col">
      <div class="flex justify-between px-[22px] pt-3 bg-white">
        <div @click="showAtPop = false"><van-icon name="arrow-down" /></div>
        <div>{{ $t('selectAtMember') }}</div>
        <div></div>
      </div>
      <van-search v-model="searchState.keyword" :placeholder="$t('placeholder.search')" @search="onSearch"
        @blur="onBlur" />
      <div v-if="!isNomal" class=" h-[64px] my-[10px] flex flex-row items-center bg-white" @click="atAllHandle">
        <img class="w-[44px] h-[44px] ml-[22px]" :src="at" alt="">
        <span class="ml-[10px]">{{ $t('atAll') }}</span>
      </div>
      <virtual-list class="my_scrollbar flex-1 overflow-scroll" :data-key="'userID'" @tobottom="loadmore"
        :data-sources="renderData" :data-component="GenericListItem" :estimate-size="88" :extra-props="(member: GroupMemberItem) => ({
          total: renderData.length,
          showCheck: checkState.showCheck,
          checked: !!checkState.checkedMemberList.find(item => item.userID === member.userID),
          onClickItem: clickItem
        })" />
      <CheckedFooter :all-checked-list="checkState.checkedMemberList" :total="renderData.length"
        @confirm="updateShowCheck" />
    </div>
  </van-popup>
</template>

<script setup lang='ts'>
import at from '@/assets/images/at.png'
import useGroupMemberList from '@/hooks/useGroupMemberList'
import useCurrentMemberRole from '@/hooks/useCurrentMemberRole'
import CheckedFooter from "@/components/CheckedFooter/index.vue";
import VirtualList from "@components/VirtualList";
import GenericListItem from "@/components/GenericListItem/index.vue";
import useConversationStore from '@/store/modules/conversation';
import { GroupMemberItem } from '@/utils/open-im-sdk-wasm/types/entity';


const emit = defineEmits(["finish", "cancel"]);
defineProps();

const { t } = useI18n()
const conversationStore = useConversationStore();

const showAtPop = ref(true)
const searchState = reactive({
  keyword: "",
  searching: false,
});
const checkState = reactive({
  showCheck: true,
  checkedMemberList: [] as GroupMemberItem[]
})
const { fetchState, getMemberData, searchMember } = useGroupMemberList(conversationStore.storeCurrentConversation.groupID);
const { isNomal } = useCurrentMemberRole(conversationStore.storeCurrentConversation.groupID);

const renderData = computed(() => searchState.searching ? fetchState.searchMemberList : fetchState.groupMemberList)

const atAllHandle = () => {
  emit("finish", {
    data: [{
      nickname: t('atAll'),
      userID: "AtAllTag",
    }],
    needDelete: true
  })
}

const updateShowCheck = () => {
  if (!checkState.showCheck) {
    checkState.checkedMemberList = [];
    checkState.showCheck = true;
    return
  }

  emit("finish", {
    data: checkState.checkedMemberList,
    needDelete: true
  })
}

const onSearch = () => {
  if (!searchState.keyword) {
    return;
  }
  searchState.searching = true;
  fetchState.searchOffset = 0;
  fetchState.searchMemberList = [];
  searchMember(searchState.keyword)
};

const onBlur = () => {
  if (!searchState.keyword) {
    searchState.searching = false;
  }
}

const loadmore = () => {
  if (!fetchState.hasMore) {
    return;
  }

  if (searchState.searching) {
    searchMember(searchState.keyword)
  } else {
    getMemberData()
  }
}

const clickItem = (member: GroupMemberItem) => {
  if (!checkState.showCheck) {
    emit("finish", {
      data: [member],
      needDelete: true
    })
    return;
  }

  const idx = checkState.checkedMemberList.findIndex(item => member.userID === item.userID)
  if (idx > -1) {
    const tmpArr = [...checkState.checkedMemberList]
    tmpArr.splice(idx, 1)
    checkState.checkedMemberList = tmpArr
  } else {
    checkState.checkedMemberList = [...checkState.checkedMemberList, member]
  }
}

const closed = () => emit("cancel")

</script>

<style lang='scss' scoped></style>