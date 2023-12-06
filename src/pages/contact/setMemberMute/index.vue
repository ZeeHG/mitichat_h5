<template>
  <div class="page_container">
    <NavBar :title="$t('setMuteTitle')">
      <span @click="saveChange">{{ t("buttons.save") }}</span>
    </NavBar>

    <div class="m-[10px] overflow-hidden rounded-md">
      <div v-for="(item, i) in MuteOptions" @click="clickItem(item.value)"
        class="flex justify-between items-center px-4 py-3 bg-white">
        <div>{{ item.label }}</div>
        <div class="flex justify-between items-center">
          <div class="flex justify-between items-center text-[#999]">
            <img v-if="mutedSeconds === item.value" class="w-[24px] h-[24px]" :src="select" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import select from '@assets/images/setting/select.png'
import { IMSDK } from "@/utils/imCommon";
import useConversationStore from '@/store/modules/conversation';
import useContactStore from '@/store/modules/contact';
import { feedbackToast } from '@/utils/common';

const { t, locale } = useI18n()
const router = useRouter();
const contactStore = useContactStore();
const conversationStore = useConversationStore();

const MuteOptions = [
  { label: `10${t('date.minute')}`, value: 10 * 60 },
  { label: `1${t('date.hour')}`, value: 60 * 60 },
  { label: `12${t('date.hour')}`, value: 12 * 60 * 60 },
  { label: `1${t('date.day')}`, value: 24 * 60 * 60 },
  { label: t('cancelMute'), value: 0 }
]

const mutedSeconds = ref(10 * 60)

watch(locale, () => {
  MuteOptions[0].label = `10${t('date.minute')}`
  MuteOptions[1].label = `1${t('date.hour')}`
  MuteOptions[2].label = `12${t('date.hour')}`
  MuteOptions[3].label = `1${t('date.day')}`
  MuteOptions[4].label = t('cancelMute')
});

const saveChange = () => {
  IMSDK.changeGroupMemberMute({
    groupID: conversationStore.currentConversation.groupID,
    userID: contactStore.userCardData.groupMemberInfo?.userID!,
    mutedSeconds: mutedSeconds.value,
  })
    .then(() => {
      feedbackToast()
      router.back()
    })
    .catch((err) => feedbackToast({ error: err.message }))
}

const clickItem = (item: number) => {
  mutedSeconds.value = item
}

</script>

<style lang='scss' scoped></style>