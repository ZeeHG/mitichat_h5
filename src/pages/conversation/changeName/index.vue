<template>
  <div class="page_container">
    <NavBar :title="title"/>
    <div class="px-9 pt-9 pb-9 bg-white flex flex-col items-center h-full">
      <div class="flex items-center w-full">
        <div class="ml-4  text-[#333]">
        <div class="mt-12 mb-8">{{ tip }}</div>
        </div>
      </div>
      <div class="flex justify-center items-center border border-gap-text rounded-lg">
      <Avatar :size="48" :src="conversationStore.currentConversation.faceURL" is-group />
        <van-field class="!py-1" :maxlength="16" v-model="name" label=""
          :placeholder="$t('placeholder.pleaseInput')"></van-field>
      </div>
      <div class="mt-20 mb-8 text-sm w-3/5 text-[#999]">
       <van-button block type="primary"  color="#7232dd" :disabled="!name" @click="finishChange">
        {{ t("buttons.confirm") }}
       </van-button>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import { GroupItem, GroupMemberItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';
import useConversationSettings from "@/hooks/useConversationSettings";



const { t } = useI18n()
const router = useRouter();
const props = defineProps<{ 
  originData: GroupItem & GroupMemberItem;
  isGroup?: boolean;
  }>()

const name = ref(props.originData.nickname || props.originData.groupName);

const title = props.originData.groupName ? t('changeGroupName') : t('changeGroupNickname')

const tip = props.isGroup ? t("messageTip.modifyGroupname") : t("messageTip.modifyNickname")

const {conversationStore} = useConversationSettings();

const finishChange = () => {
  let func
  if (props.originData.groupName) {
    func = IMSDK.setGroupInfo({
      groupID: props.originData.groupID,
      groupName: name.value
    })
  } else {
    func = IMSDK.setGroupMemberNickname({
      groupID: props.originData.groupID,
      userID: props.originData.userID,
      groupMemberNickname: name.value
    })
  }
  func
    .then(() => feedbackToast({ message: t('messageTip.changeSuccess'), onClose: router.back }))
    .catch((error) => feedbackToast({ message: t('messageTip.changeFailed'), error }))
}
</script>

<style lang='scss' scoped></style>