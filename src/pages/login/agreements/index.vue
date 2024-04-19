<template>
  <div class="page_container ">
    <NavBar :title="title"/>
    <div class="px-9 pt-9 pb-9 bg-white flex flex-col items-center h-full overflow-scroll">
      <div v-if="isUserAgreement">
        <p class="font-bold">{{t("userAgreementTextWelcome.title")}}</p>
          <br>
        <p>{{t('userAgreementTextWelcome.context')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText1.title')}}</p>
          <br>
        <p>{{t('userAgreementText1.context')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText2.title')}}</p>
          <br>
        <p>{{t('userAgreementText2.context')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText3.title1')}}</p>
          <br>
        <p>{{t('userAgreementText3.title2')}}</p>
          <br>
        <p>{{t('userAgreementText3.subTitle1')}}</p>
        <p>{{t('userAgreementText3.context1')}}</p>
          <br>
        <p>{{t('userAgreementText3.subTitle2')}}</p>
        <p>{{t('userAgreementText3.context2')}}</p>
          <br>
        <p>{{t('userAgreementText3.subTitle3')}}</p>
        <p>{{t('userAgreementText3.context3')}}</p>
          <br>
        <p>{{t('userAgreementText3.context31')}}</p>
          <br>
        <p>{{t('userAgreementText3.subTitle4')}}</p>
        <p>{{t('userAgreementText3.context4')}}</p>
          <br>
        <p>{{t('userAgreementText3.subTitle5')}}</p>
        <p>{{t('userAgreementText3.context5')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText4.title1')}}</p>
          <br>
        <p>{{t('userAgreementText4.subTitle1')}}</p>
          <br>
        <p>{{t('userAgreementText4.context1')}}</p>
        <p>{{t('userAgreementText4.subTitle2')}}</p>
        <p>{{t('userAgreementText4.context2')}}</p>
          <br>
        <p>{{t('userAgreementText4.subTitle3')}}</p>
        <p>{{t('userAgreementText4.context3')}}</p>
          <br>
        <p>{{t('userAgreementText4.subTitle4')}}</p>
        <p>{{t('userAgreementText4.context4')}}</p>
          <br>
        <p>{{t('userAgreementText4.subTitle5')}}</p>
        <p>{{t('userAgreementText4.context5')}}</p>
          <br>
        <p>{{t('userAgreementText4.subTitle6')}}</p>
        <p>{{t('userAgreementText4.context6')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText5.title1')}}</p>
          <br>
        <p>{{t('userAgreementText5.subTitle1')}}</p>
        <p>{{t('userAgreementText5.context1')}}</p>
          <br>
        <p>{{t('userAgreementText5.subTitle2')}}</p>
        <p>{{t('userAgreementText5.context2')}}</p>
          <br>
        <p>{{t('userAgreementText5.subTitle3')}}</p>
        <p>{{t('userAgreementText5.context3')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText6.title1')}}</p>
          <br>
        <p>{{t('userAgreementText6.subTitle1')}}</p>
        <p>{{t('userAgreementText6.context11')}}</p>
         <br>
        <p>{{t('userAgreementText6.context12')}}</p>
          <br>
        <p>{{t('userAgreementText6.subTitle2')}}</p>
        <p>{{t('userAgreementText6.context2')}}</p>
          <br>
        <p>{{t('userAgreementText6.subTitle3')}}</p>
        <p>{{t('userAgreementText6.context3')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText7.title1')}}</p>
          <br>
        <p>{{t('userAgreementText7.subTitle1')}}</p>
        <p>{{t('userAgreementText7.context1')}}</p>
          <br>
        <p>{{t('userAgreementText7.subTitle2')}}</p>
        <p>{{t('userAgreementText7.context2')}}</p>
        <br>
        <p class="font-bold">{{t('userAgreementText8.title1')}}</p>
          <br>
        <p>{{t('userAgreementText8.subTitle1')}}</p>
        <p>{{t('userAgreementText8.context11')}}</p>
        <br>
        <p>{{t('userAgreementText8.context12')}}</p>
        <br>
        <p>{{t('userAgreementEnd.context')}}</p>
      </div>
     <div v-else>隐私协议</div>
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