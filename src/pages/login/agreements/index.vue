<template>
  <div class="page_container">
    <NavBar :title="title"/>
    <div class="px-9 pt-9 pb-9 bg-white flex flex-col items-center h-full">
     <p v-if="isUserAgreement">用户协议</p>
     <p v-else>隐私协议</P>
    </div>
  </div>
</template>
<script setup lang='ts'>
import NavBar from '@/components/NavBar/index.vue';
import { IMSDK } from '@/utils/imCommon';
import { feedbackToast } from '@/utils/common';
import useConversationSettings from "@/hooks/useConversationSettings";



const { t } = useI18n()
const router = useRouter();
const props = defineProps<{ isUserAgreement: boolean; }>()


const title = props.isUserAgreement ? t('userAgreement') : t('privacyAgreement')





</script>

<style lang='scss' scoped></style>