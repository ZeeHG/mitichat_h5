<template>
  <div class="page_container !bg-white">
    <NavBar :title="'消息'">
      <div @click="tryClear">清空</div>
    </NavBar>
    <div class="overflow-y-auto" ref="el">
      <IMessageItem v-for="item, i in source.workMoments" :source="item" :key="item.workMomentID"
        :border="i !== source.workMoments.length - 1" />
      <div class="flex items-center justify-center h-[38px] bg-[#F8F9FA] text-xs text-sub-text">
        没有更多消息了
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue';
import IMessageItem from './IMessageItem.vue'
import { MomentsClearType, clearUnreadMoments, getMomentLogs } from '@/api/moments';
import { useInfiniteScroll } from '@vueuse/core'
import { WorkMoments } from '@/types/moment';
import { closeToast, showLoadingToast } from 'vant';

type Source = {
  workMoments: WorkMoments[],
  loading: boolean,
  hasMore: boolean,
  current: number
}
const el = ref<HTMLElement | null>(null)
const source = reactive<Source>({
  workMoments: [],
  loading: false,
  hasMore: true,
  current: 1,
})

onMounted(() => {
  fetchData()
  clearUnread()
})

useInfiniteScroll(
  el,
  () => {
    fetchData()
  },
  { distance: 50 }
)

const clearUnread = async () => {
  await clearUnreadMoments(MomentsClearType.Count)
}

const fetchData = async () => {
  if (!source.hasMore || source.loading) return
  source.loading = true
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  });
  const { data } = await getMomentLogs(source.current)
  source.workMoments = [...source.workMoments, ...data.workMoments ?? []]
  source.current++
  source.hasMore = data.workMoments?.length === 20
  source.loading = false
  closeToast()
}

const tryClear = async () => {
  await clearUnreadMoments(MomentsClearType.List)
  source.workMoments = []
}
</script>