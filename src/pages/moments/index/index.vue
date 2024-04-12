<template>
  <div class="page_container !bg-white">
    <MomentsHeader />
    <div class="overflow-y-auto overflow-hidden" ref="el">
      <img class="mt-[-46px]" :src="background" alt="">
      <div v-if="unread" class="flex mt-4 justify-center items-center" @click="router.push('/interactiveMessage')">
        <span class="px-4 py-1.5 text-white bg-[#0C1C33] bg-opacity-30 rounded-md text-sm">{{ unread }}条新消息</span>
      </div>
      <MomentsItem v-for="item in source.workMoments" :source="item" :item="item" @startComment="startComment"
        :key="item.workMomentID" @tryDeleteMoment="tryDeleteMoment" />
    </div>
    <div v-if="commentState.show" class="px-4 py-2 bg-[#F0F2F6] flex justify-center items-center">
      <CustomEdit class="bg-[#fff] flex-1" ref="inputRef" v-model:input="commentState.content" :placeholder="''" />
      <img @click="tryComment" class="h-[26px] min-w-[26px] ml-2" :src="send" alt="send">
    </div>
  </div>
</template>

<script setup lang="ts" name="moments">
import background from '@/assets/images/moments/background.png'
import send from '@/assets/images/chatFooter/send.png'

import MomentsHeader from './components/MomentsHeader.vue'
import MomentsItem from './components/MomentsItem.vue'
import { createComment, deleteMoment, fetchUserMoments, getMomentsUnreadCount } from '@/api/moments';
import CustomEdit from '@/components/CustomEdit/index.vue';
import { onClickOutside, useInfiniteScroll } from '@vueuse/core';
import { Comments, WorkMoments } from '@/types/moment';
import { closeToast, showLoadingToast } from 'vant';
import { IMSDK } from '@/utils/imCommon';
import { CbEvents } from '@/utils/open-im-sdk-wasm/constant';
import { WSEvent } from '@/utils/open-im-sdk-wasm/types/entity';

type Source = {
  workMoments: WorkMoments[],
  loading: boolean,
  hasMore: boolean,
  current: number
}

onMounted(() => {
  fetchData()
  fetchUnread()
  IMSDK.on(CbEvents.OnRecvCustomBusinessMessage, customMessageHandler);
})

onBeforeMount(() => {
  IMSDK.off(CbEvents.OnRecvCustomBusinessMessage, customMessageHandler);
})

const el = ref<HTMLElement | null>(null)
const inputRef = ref();
const unread = ref(0)
const router = useRouter()

const commentState = reactive({
  show: false,
  content: "",
  workMomentID: '',
  comment: {
    userID: '',
    nickname: '',
  }
})
const source = reactive<Source>({
  workMoments: [],
  loading: false,
  hasMore: true,
  current: 1,
})

useInfiniteScroll(
  el,
  () => {
    fetchData()
  },
  { distance: 50 }
)

onClickOutside(inputRef, () => {
  commentState.show = false
}, {
  ignore: ['.van-overlay', '.van-action-sheet__content']
})

const customMessageHandler = ({
  data: { key, data },
}: WSEvent<{ key: string; data: string }>) => {
  console.log("customMessageHandler", data);
  if (key.includes("wm_")) {
    fetchUnread()
    const moments = JSON.parse(data).body as WorkMoments;
    const idx = source.workMoments.findIndex((item) => item.workMomentID === moments.workMomentID)
    source.workMoments[idx] = { ...source.workMoments[idx], ...moments }
  }
}

const fetchUnread = async () => {
  const { data } = await getMomentsUnreadCount()
  unread.value = data.total
}

const fetchData = async () => {
  if (!source.hasMore || source.loading) return
  source.loading = true
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  });
  const { data } = await fetchUserMoments(source.current)
  source.workMoments = [...source.workMoments, ...data.workMoments ?? []]
  source.current++
  source.hasMore = data.workMoments?.length === 20
  source.loading = false
  closeToast()
}

const tryComment = async () => {
  await createComment({ workMomentID: commentState.workMomentID, content: commentState.content, replyUserID: commentState.comment.userID, momentType: 1 })
}

const startComment = (workMomentID: string, comment: Comments) => {
  commentState.content = ''
  commentState.show = true
  commentState.workMomentID = workMomentID
  commentState.comment = comment || { nickname: '', userID: '' }
  nextTick(() => {
    inputRef.value.inputRef.innerHTML = ""
    inputRef.value.inputRef.focus()
  })
}

const tryDeleteMoment = async (workMomentID: string) => {
  await deleteMoment(workMomentID)
  source.workMoments = source.workMoments.filter((item) => item.workMomentID !== workMomentID)
}

</script>
