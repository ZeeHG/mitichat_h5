<template>
  <div class="page_container !bg-white">
    <van-nav-bar :title="''" placeholder fixed left-arrow :clickable="false" :border="false" @click-left="router.back()">
      <template #left>
        <img class="w-3 h-5" :src="arrows" alt="" />
      </template>
    </van-nav-bar>
    <div class="overflow-y-auto overflow-hidden !relative" ref="el">
      <img class="mt-[-46px]" :src="background" alt="">
      <Avatar class="!absolute top-[104px] left-4" :size="48" :src="user.faceURL" :desc="user.nickname" />
      <div class="!absolute left-[74px] top-[104px] h-[48px] flex justify-center items-center text-white">
        {{ user.nickname }}
      </div>
      <div v-for="group in groups" class="mt-6">
        <div v-for="(item, i) in group.objects" class="flex items-start" @click="toDetails(item.workMomentID)">
          <div class="flex justify-center font-semibold w-[60px]">
            <span v-if="i === 0">{{ group.date }}</span>
          </div>
          <div v-if="item.content.metas.length > 0" class="flex flex-1 flex-row mb-2 px-3">
            <img class="w-[90px] h-[90px] " :src="item.content.metas[0].thumb" />
            <view class="flex h-[90px] flex-1 flex-col justify-between items-start ml-2">
              <span class="line-clamp-3 w-full break-all overflow-hidden">{{ item.content.text }}</span>
              <span class=" text-sub-text text-sm">共{{ item.content.metas.length }}张</span>
            </view>
          </div>
          <div v-else class="flex flex-1 flex-row mb-2 px-3 overflow-hidden">
            <div class="px-2 py-3 bg-[#E8EAEF] w-full">
              <span class="line-clamp-2 w-full break-all overflow-hidden">{{ item.content.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchUserMoments } from '@/api/moments';
import Avatar from '@/components/Avatar/index.vue';
import arrows from '@/assets/images/moments/back.png'
import background from '@/assets/images/moments/background.png'
import { WorkMoments } from '@/types/moment';
import { useInfiniteScroll } from '@vueuse/core';
import { closeToast, showLoadingToast } from 'vant';
import dayjs from 'dayjs';

type Source = {
  workMoments: WorkMoments[],
  loading: boolean,
  hasMore: boolean,
  current: number
}

const el = ref<HTMLElement | null>(null)
const user = reactive({
  userID: '',
  nickname: '',
  faceURL: '',
})
const router = useRouter();

onBeforeMount(() => {
  const state = history.state
  user.userID = state.userID
  user.nickname = state.nickname
  user.faceURL = state.faceURL
})

onMounted(() => {
  fetchData()
})

useInfiniteScroll(
  el,
  () => {
    fetchData()
  },
  { distance: 50 }
)

const source = reactive<Source>({
  workMoments: [],
  loading: false,
  hasMore: true,
  current: 1,
})

const groups = computed(() => {
  const groupsMap = new Map();
  const currentDate = dayjs().format("YYYY-MM-DD");
  source.workMoments.forEach((obj) => {
    const objDate = dayjs.unix(obj.createTime / 1000);

    if (objDate.format("YYYY-MM-DD") === currentDate) {
      const todayKey = "今日";
      if (!groupsMap.has(todayKey)) {
        groupsMap.set(todayKey, []);
      }
      groupsMap.get(todayKey).push(obj);
    } else if (objDate.add(1, "day").format("YYYY-MM-DD") === currentDate) {
      const yesterdayKey = "昨日";
      if (!groupsMap.has(yesterdayKey)) {
        groupsMap.set(yesterdayKey, []);
      }
      groupsMap.get(yesterdayKey).push(obj);
    } else {
      const otherKey = objDate.format("MM-DD");
      if (!groupsMap.has(otherKey)) {
        groupsMap.set(otherKey, []);
      }
      groupsMap.get(otherKey).push(obj);
    }
  });
  return Array.from(groupsMap, ([date, objects]) => ({
    date,
    objects,
  }));
})

const fetchData = async () => {
  console.log('fetchData')
  if (!source.hasMore || source.loading) return
  source.loading = true
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  });
  const { data } = await fetchUserMoments(source.current, user.userID + '')
  source.workMoments = [...source.workMoments, ...data.workMoments ?? []]
  source.current++
  source.hasMore = data.workMoments?.length === 20
  source.loading = false
  closeToast()
}

const toDetails = (workMomentID: string) => {
  router.push({
    path: '/momentsDetails',
    query: {
      workMomentID
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.van-nav-bar) {
  background-image: url(@/assets/images/moments/background.png);
  background-position: top;
  background-size: cover;
}
</style>