<template>
  <div class="page_container !bg-white">
    <NavBar :title="'详情'" />
    <div class="flex-1 overflow-y-auto">
      <MomentsItem v-if="!loading" :source="workMoment!" :item="workMoment" @StartComment="startComment"
        :showDetails="true" @tryDeleteMoment="tryDeleteMoment" />
    </div>
    <div v-if="commentState.show" class="px-4 py-2 bg-[#F0F2F6] flex justify-center items-center">
      <CustomEdit v-show="true" class="bg-[#fff] flex-1" ref="inputRef" v-model:input="commentState.content"
        :placeholder="''" />
      <img @click="tryComment" class="h-[26px] min-w-[26px] ml-2" :src="send" alt="send">
    </div>
  </div>
</template>

<script lang="ts" setup>
import send from '@/assets/images/chatFooter/send.png'

import NavBar from '@/components/NavBar/index.vue';
import MomentsItem from '../index/components/MomentsItem.vue';
import { onClickOutside } from '@vueuse/core';
import { createComment, deleteMoment, getMomentsByID } from '@/api/moments';
import { Comments, WorkMoments } from '@/types/moment';
import CustomEdit from '@/components/CustomEdit/index.vue';
import { WSEvent } from '@/utils/open-im-sdk-wasm/types/entity';
import { IMSDK } from '@/utils/imCommon';
import { CbEvents } from '@/utils/open-im-sdk-wasm/constant';

type MomentsDetailsProps = {
  workMomentID: string,
}

const props = defineProps<MomentsDetailsProps>();

const loading = ref(true)
const inputRef = ref();
const workMoment = ref<WorkMoments>()
const router = useRouter();

const commentState = reactive({
  show: false,
  content: "",
  workMomentID: '',
  comment: {
    userID: '',
    nickname: '',
  }
})

onClickOutside(inputRef, () => {
  commentState.show = false
  commentState.content = ''
}, {
  ignore: ['.van-overlay', '.van-action-sheet__content']
})

onMounted(() => {
  getMoments()
  IMSDK.on(CbEvents.OnRecvCustomBusinessMessage, customMessageHandler);
})

onBeforeMount(() => {
  IMSDK.off(CbEvents.OnRecvCustomBusinessMessage, customMessageHandler);
})

const customMessageHandler = ({
  data: { key, data },
}: WSEvent<{ key: string; data: string }>) => {
  console.log("customMessageHandler", data);
  if (key.includes("wm_")) {
    const moments = JSON.parse(data).body as WorkMoments;
    if (workMoment.value!.workMomentID === moments.workMomentID) {
      workMoment.value = moments
    }
  }
}

const getMoments = async () => {
  loading.value = true
  const { data } = await getMomentsByID(props.workMomentID)
  workMoment.value = data.workMoment
  loading.value = false
}

const tryComment = async () => {
  await createComment({ workMomentID: commentState.workMomentID, content: commentState.content, replyUserID: commentState.comment.userID })
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
  router.back()
}
</script>