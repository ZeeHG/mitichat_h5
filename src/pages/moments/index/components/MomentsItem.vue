<template>
  <div class="flex p-4 " :class="{ 'border-b': !showDetails }">
    <Avatar :size="48" :src="source.faceURL" :desc="source.nickname"
      @click="toDesignatedMoments(source.userID, source.nickname, source.faceURL)" />
    <div class="ml-3 flex-1 overflow-hidden">
      <div class="text-[#6085B1] break-all mb-1">{{ source.nickname }}</div>
      <div class="w-full">
        <span class="break-all">{{ source.content.text }}</span>
      </div>

      <div class="flex flex-wrap mx-[-4px]" v-if="source.content.metas.length > 0">
        <template v-if="source.content.type === 0">
          <van-image class="w-[90px] h-[90px] p-1" fit="cover" :src="item.original" v-for="item in source.content.metas"
            @click="imagePreview(item.original)" />
        </template>
        <template v-if="source.content.type === 1">
          <div v-for="item in source.content.metas" class="relative" @click="showVideoPreview(item.original, item.thumb)" >
            <van-image class="w-[90px] h-[90px] p-1" fit="cover" :src="item.thumb" />
            <img class=" absolute w-[36px] h-[36px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
              :src="play_icon" alt="" />
          </div>
        </template>
      </div>

      <div class="text-xs text-sub-text" v-if="source.atUsers.length > 0">{{ atStr }}</div>

      <div class="flex flex-row items-center justify-between mt-1">
        <div class="flex flex-row items-center">
          <div class="text-xs text-sub-text">{{ createTime }}</div>
          <img v-if="source.permission === 1" class="w-[9px] h-[10px] ml-2" :src="private_img" alt="" />
          <div v-if="source.permission === 1" class="text-xs text-[#6085B1] ml-1">私密</div>
          <img v-if="source.permission === 2 || source.permission === 3" class="w-[15px] h-[10px] ml-2" :src="assign"
            alt="" />
          <div v-if="source.permission === 2 || source.permission === 3" class="text-xs text-[#6085B1] ml-1">部分可见</div>
          <div v-if="source.userID === userStore.selfInfo.userID" class="text-xs text-[#6085B1] ml-2"
            @click="() => emit('tryDeleteMoment', source.workMomentID)">删除</div>
        </div>
        <van-popover placement="left" :show-arrow="false" v-model="showActions" actions-direction="horizontal">
          <div class="px-4.5 py-2 flex flex-row bg-[#0C1C33]">
            <div class="flex flex-row items-center justify-center mr-4" @click="likeOrNot">
              <img class="w-4 h-4 mr-1" :src="likeIcon" alt="">
              <div class="text-xs text-white">赞</div>
            </div>
            <div class="flex flex-row items-center justify-center" @click="emit('startComment', source.workMomentID)">
              <img class="w-4 h-4 mr-1" :src="commit" alt="">
              <div class="text-xs text-white">评论</div>
            </div>
          </div>
          <template #reference>
            <img class="w-[22px] h-[14px]" :src="more" alt="" @click="showActions = true" />
          </template>
        </van-popover>
      </div>

      <div class="flex flex-row justify-start items-center mt-1" v-if="likeStr">
        <img class="w-4 h-4 mr-1" :src="like" alt="" />
        <div class="text-xs text-sub-text">{{ likeStr }}</div>
      </div>

      <div class="mt-1 overflow-hidden">
        <CommentItem v-for="item in source.comments" :key="item.commentID" :comment="item" :momentsUserID="source.userID"
          @deleteComent="deleteComent" @startComment="() => emit('startComment', source.workMomentID, item)" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import assign from '@/assets/images/moments/assign.png'
import more from '@/assets/images/moments/more.png'
import like from '@/assets/images/moments/like.png'
import liked from '@/assets/images/moments/liked.png'
import commit from '@/assets/images/moments/commit.png'
import private_img from '@/assets/images/moments/private.png'
import play_icon from '@/assets/images/chating_message_video_play.png'

import Avatar from '@/components/Avatar/index.vue';
import CommentItem from './CommentItem.vue'
import { WorkMoments } from '@/types/moment'
import { deleteComment, likeMoment } from '@/api/moments'
import { showImagePreview } from 'vant'
import useUserStore from '@/store/modules/user';
import { formatConversionTime } from '@/utils/imCommon'
import showVideoPreview from '@/utils/showVideoPreview'

type ConversationItemProps = {
  source: WorkMoments;
  showDetails?: Boolean,
}

const emit = defineEmits(['startComment', 'tryDeleteMoment']);
const props = defineProps<ConversationItemProps>();

const router = useRouter()
const userStore = useUserStore()
const showActions = ref(false);

const atStr = computed(() => "提到了：" + props.source.atUsers.map(user => user.nickname).join('、'))
const likeStr = computed(() => props.source.likeUsers.map(user => user.nickname).join('、'))
const isLiked = computed(() => props.source.likeUsers.some((item) => item.userID === userStore.selfInfo.userID))
const likeIcon = computed(() => isLiked.value ? liked : like)
const createTime = computed(() => formatConversionTime(props.source.createTime))

const deleteComent = async (commentID: string) => {
  await deleteComment(props.source.workMomentID, commentID)
}

const likeOrNot = async () => {
  await likeMoment({ workMomentID: props.source.workMomentID, like: !isLiked.value })
}

const imagePreview = (target: string) => {
  const images = props.source.content.metas.map((item) => item.original);
  const index = images.indexOf(target);
  showImagePreview({ images, startPosition: index });
}

const toDesignatedMoments = (userID: string, nickname: string, faceURL: string) => {
  if (props.showDetails) return
  router.push({
    path: '/designatedMoments',
    state: {
      userID,
      nickname,
      faceURL
    }
  })
}
</script>

<style lang='scss' scoped></style>