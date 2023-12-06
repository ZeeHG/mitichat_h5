<template>
  <div class="flex p-4" :class="{ 'border-b': border }">
    <Avatar :size="48" :src="opItem.faceURL" :desc="opItem.nickname" />
    <div class="flex flex-row ml-3 flex-1 overflow-hidden justify-between items-center">
      <div class="flex flex-col">
        <div>{{ opItem.nickname }}</div>
        <div class="text-sm flex-1">
          <div class="flex flex-row items-center" v-if="source?.type === 1">
            <img class="w-[13px] h-[13px]" :src="like" alt="">
            <span>为你点了赞</span>
          </div>

          <span v-if="source?.type === 2">提到了你</span>

          <span v-if="source?.type === 3 && source?.comments[0].replyUserID === ''">{{
            `评论了你：${source?.comments[0].content}`
          }}</span>

          <span v-if="source?.type === 3 && source?.comments[0].replyUserID !== ''" class=" break-all">
            {{ source?.comments[0].nickname }}
            <span class="text-primary">回复</span>
            {{ `${source?.comments[0].replyNickname}：${source?.comments[0].content}` }}
          </span>

        </div>
        <div class=" text-xs text-sub-text mt-2">{{ createTime }}</div>
      </div>
      <img v-if="getImage" class="w-[62px] h-[62px] shrink-0 ml-1" :src="getImage" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">
import like from '@/assets/images/moments/like.png'
import Avatar from '@/components/Avatar/index.vue';
import { WorkMoments } from '@/types/moment';
import { formatConversionTime } from '@/utils/imCommon'

type IMessageItemProps = {
  source: WorkMoments;
  border?: boolean
}
const props = defineProps<IMessageItemProps>();

const createTime = computed(() => {
  if (props.source?.type === 3) {
    return formatConversionTime(props.source.comments[0].createTime)
  }
  return formatConversionTime(props.source.createTime)
})

const opItem = computed(() => {
  if (props.source?.type === 1) {
    return props.source.likeUsers[0];
  }
  if (props.source?.type === 2) {
    return props.source;
  }
  return props.source.comments[0];
})

const getImage = computed(() => {
  if (props.source.content.metas.length <= 0) {
    return ''
  }
  if (props.source.content.type === 0) {
    return props.source.content.metas[0].original
  }
  return props.source.content.metas[0].thumb
})

</script>