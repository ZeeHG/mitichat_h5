<template>
  <div class=" overflow-hidden">
    <van-popover v-if="hasPermission" placement="top" v-model:show="showDelete" theme="dark" trigger="manual">
      <div class="px-4 py-2 bg-[#0C1C33] text-xs overflow-hidden" @click="tryDeleteComent">
        删除
      </div>
      <template #reference>
        <div ref="commentRef" class="py-0.5 px-2 bg-[#F8F9FA]" @click="emit('startComment')">
          <span class="text-[#6085B1] text-sm">{{ comment.nickname }}</span>
          <span v-if="showReply" class="text-sm mx-1">回复</span>
          <span v-if="showReply" class="text-[#6085B1] text-sm">{{ comment.replyNickname }}</span>
          <span class="text-sm break-all">：{{ comment.content }}</span>
        </div>
      </template>
    </van-popover>
    <div v-else class="py-0.5 px-2 bg-[#F8F9FA]" @click="emit('startComment')">
      <span class="text-[#6085B1] text-sm">{{ comment.nickname }}</span>
      <span v-if="showReply" class="text-sm mx-1">回复</span>
      <span v-if="showReply" class="text-[#6085B1] text-sm">{{ comment.replyNickname }}</span>
      <span class="text-sm break-all">：{{ comment.content }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import useUserStore from '@/store/modules/user';
import { Comments } from '@/types/moment';
import { onLongPress } from '@vueuse/core';

type ComentItemProps = {
  comment: Comments,
  momentsUserID: String,
}
const emit = defineEmits(['deleteComent', 'startComment']);
const props = defineProps<ComentItemProps>();

const commentRef = ref();
const showDelete = ref(false);
const userStore = useUserStore()

const hasPermission = computed(() => props.comment.userID === userStore.selfInfo.userID || props.momentsUserID === userStore.selfInfo.userID)
const showReply = computed(() => props.comment.replyUserID !== '')

const runDeleteComent = () => {
  if (props.comment.userID === userStore.selfInfo.userID || props.momentsUserID === userStore.selfInfo.userID) {
    showDelete.value = true
  }
}

onLongPress(
  commentRef,
  runDeleteComent,
  { modifiers: { prevent: true } }
)

const tryDeleteComent = () => {
  emit('deleteComent', props.comment.commentID)
  showDelete.value = false
}

</script>

<style lang='scss' scoped></style>
