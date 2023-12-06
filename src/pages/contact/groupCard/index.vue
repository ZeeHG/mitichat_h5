<template>
  <div class="page_container">
    <NavBar />

    <div class="flex-1">
      <div class="flex items-center px-4 py-6 bg-white">
        <Avatar :size="48" :src="conversationStore.storeCurrentGroupInfo.faceURL" is-group />
        <div class="ml-2">
          <div class="font-medium text-lg">
            <span>{{ conversationStore.storeCurrentGroupInfo.groupName }}</span>
            <span>{{ `(${conversationStore.storeCurrentGroupInfo.memberCount})` }}</span>
          </div>
          <div>
            <van-icon name="clock" size="13" color="#ADADAD" />
            <span class="text-sm text-[#ADADAD] ml-1">{{ groupCreateTime }}</span>
          </div>
        </div>
      </div>

      <div class="my-2 px-4 py-4 bg-white" @click="toMemberList">
        <div class="flex items-center justify-between">
          <div>
            <span>{{ $t('groupMember') }}</span>
            <span class="text-sub-text ml-3">{{
              $t('somePeople', { count: conversationStore.storeCurrentGroupInfo.memberCount }) }}</span>
          </div>
          <van-icon name="arrow" color="#999" />
        </div>
        <div class="mt-3 flex">
          <Avatar class="mr-2 last:mr-0" v-for="member in comptMemberRow" :key="member.userID" :src="member.faceURL"
            :desc="member.nickname" :size="42" />
          <img class="w-[42px] h-[42px]" :src="more" alt="">
        </div>
      </div>

      <div class="px-4 py-4 bg-white">
        <span>{{ $t('groupID') }}</span>
        <span class="ml-3 text-sub-text">{{ conversationStore.storeCurrentGroupInfo.groupID }}</span>
      </div>
    </div>


    <div class="flex justify-between w-full px-[22px] mb-6 mt-8">
      <van-button type="primary" class="w-full !ml-1 text-base" :text="comptInGroup ? $t('sendMessage') : $t('applyJoin')"
        @click="toConversationOrApply" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import more from '@/assets/images/setting/more.png'
import NavBar from '@/components/NavBar/index.vue';
import Avatar from '@/components/Avatar/index.vue';
import useConversationStore from '@/store/modules/conversation';
import useContactStore from '@/store/modules/contact';
import useGroupMemberList from '@/hooks/useGroupMemberList';
import dayjs from 'dayjs';
import { SessionType } from '@/utils/open-im-sdk-wasm/types/enum';
import { MemberListActionEnum } from '../groupMemberList/data';
import useConversationToggle from '@/hooks/useConversationToggle';

const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore();
const { toSpecifiedConversation } = useConversationToggle();

const { fetchState } = useGroupMemberList()

const groupCreateTime = dayjs(conversationStore.storeCurrentGroupInfo.createTime).format('YYYY-MM-DD')
const comptInGroup = computed(() => contactStore.storeGroupList.findIndex(group => group.groupID === conversationStore.storeCurrentGroupInfo.groupID) > -1)
const comptMemberRow = computed(() => {
  if (comptInGroup.value) {
    return fetchState.groupMemberList.slice(0, 6)
  }
  const memberCount = conversationStore.storeCurrentGroupInfo.memberCount ?? 0
  return new Array(memberCount >= 6 ? 6 : memberCount).fill(1).map((_, idx) => ({
    userID: idx,
    nickname: '',
    faceURL: "",
  }))
})

const toConversationOrApply = () => {
  const sessionType = SessionType.Group
  if (comptInGroup.value) {
    toSpecifiedConversation({
      sourceID: conversationStore.storeCurrentGroupInfo.groupID,
      sessionType: sessionType
    })
  } else {
    router.push({
      path: 'sendApplication',
      query: {
        isGroup: 'true',
        sourceID: conversationStore.storeCurrentGroupInfo.groupID,
        isScan: 'false',
        notNeedVerification: 'false',
        sessionType
      }
    })
  }
}

const toMemberList = () => {
  if (comptInGroup.value) {
    router.push({
      path: 'groupMemberList',
      state: {
        groupID: conversationStore.storeCurrentGroupInfo.groupID,
        action: MemberListActionEnum.Preview
      }
    })
  }
}

onMounted(() => {
  conversationStore.getCurrentMemberInGroupFromReq(conversationStore.storeCurrentGroupInfo.groupID);
})

</script>

<style lang='scss' scoped></style>