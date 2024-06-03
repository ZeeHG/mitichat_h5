<template>
  <div class="page_container">
    <NavBar :title="title" />
    <div
      class="px-9 pt-9 pb-9 bg-white flex flex-col items-center h-full overflow-scroll"
    >
      <div v-if="isUserAgreement">
        <p class="font-bold">{{ t("userAgreementTextWelcome.title") }}</p>
        <br />
        <p>{{ t("userAgreementTextWelcome.context") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText1.title") }}</p>
        <br />
        <p>{{ t("userAgreementText1.context") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText2.title") }}</p>
        <br />
        <p>{{ t("userAgreementText2.context") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText3.title1") }}</p>
        <br />
        <p>{{ t("userAgreementText3.title2") }}</p>
        <br />
        <p>{{ t("userAgreementText3.subTitle1") }}</p>
        <p>{{ t("userAgreementText3.context1") }}</p>
        <br />
        <p>{{ t("userAgreementText3.subTitle2") }}</p>
        <p>{{ t("userAgreementText3.context2") }}</p>
        <br />
        <p>{{ t("userAgreementText3.subTitle3") }}</p>
        <p>{{ t("userAgreementText3.context3") }}</p>
        <br />
        <p>{{ t("userAgreementText3.context31") }}</p>
        <br />
        <p>{{ t("userAgreementText3.subTitle4") }}</p>
        <p>{{ t("userAgreementText3.context4") }}</p>
        <br />
        <p>{{ t("userAgreementText3.subTitle5") }}</p>
        <p>{{ t("userAgreementText3.context5") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText4.title1") }}</p>
        <br />
        <p>{{ t("userAgreementText4.subTitle1") }}</p>
        <br />
        <p>{{ t("userAgreementText4.context1") }}</p>
        <p>{{ t("userAgreementText4.subTitle2") }}</p>
        <p>{{ t("userAgreementText4.context2") }}</p>
        <br />
        <p>{{ t("userAgreementText4.subTitle3") }}</p>
        <p>{{ t("userAgreementText4.context3") }}</p>
        <br />
        <p>{{ t("userAgreementText4.subTitle4") }}</p>
        <p>{{ t("userAgreementText4.context4") }}</p>
        <br />
        <p>{{ t("userAgreementText4.subTitle5") }}</p>
        <p>{{ t("userAgreementText4.context5") }}</p>
        <br />
        <p>{{ t("userAgreementText4.subTitle6") }}</p>
        <p>{{ t("userAgreementText4.context6") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText5.title1") }}</p>
        <br />
        <p>{{ t("userAgreementText5.subTitle1") }}</p>
        <p>{{ t("userAgreementText5.context1") }}</p>
        <br />
        <p>{{ t("userAgreementText5.subTitle2") }}</p>
        <p>{{ t("userAgreementText5.context2") }}</p>
        <br />
        <p>{{ t("userAgreementText5.subTitle3") }}</p>
        <p>{{ t("userAgreementText5.context3") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText6.title1") }}</p>
        <br />
        <p>{{ t("userAgreementText6.subTitle1") }}</p>
        <p>{{ t("userAgreementText6.context11") }}</p>
        <br />
        <p>{{ t("userAgreementText6.context12") }}</p>
        <br />
        <p>{{ t("userAgreementText6.subTitle2") }}</p>
        <p>{{ t("userAgreementText6.context2") }}</p>
        <br />
        <p>{{ t("userAgreementText6.subTitle3") }}</p>
        <p>{{ t("userAgreementText6.context3") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText7.title1") }}</p>
        <br />
        <p>{{ t("userAgreementText7.subTitle1") }}</p>
        <p>{{ t("userAgreementText7.context1") }}</p>
        <br />
        <p>{{ t("userAgreementText7.subTitle2") }}</p>
        <p>{{ t("userAgreementText7.context2") }}</p>
        <br />
        <p class="font-bold">{{ t("userAgreementText8.title1") }}</p>
        <br />
        <p>{{ t("userAgreementText8.subTitle1") }}</p>
        <p>{{ t("userAgreementText8.context11") }}</p>
        <br />
        <p>{{ t("userAgreementText8.context12") }}</p>
        <br />
        <p>{{ t("userAgreementEnd.context") }}</p>
      </div>
      <div v-else>
        <p class="font-bold">{{ t("privacyAgreementText.privacyPolicy1") }}</p>
        <br />
        <p class="font-bold">{{ t("privacyAgreementText.privacyPolicy2") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy3") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy4") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy5") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy6") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy7") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy8") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy9") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy10") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy11") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy12") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy13") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy14") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy15") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy16") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy17") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy18") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy19") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy20") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy21") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy22") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy23") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy24") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy25") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy26") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy27") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy28") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy29") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy30") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy31") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy32") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy33_1") }}
        </p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy33_2") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy34") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy35") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy36_1") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy36_2") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy37_1") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy37_2") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy38") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy39") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy40") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy41_1") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy41_2") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy43_1") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy43_2") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy44_1") }}
        </p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy44_2") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy45") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy46") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy47") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy48") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy49") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy50") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy51") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy52_1") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy52_2") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy53") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy54") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy55") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy56") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy57") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy58") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy59") }}</p>
        <br />
        <p class="font-bold">{{ t("privacyAgreementText.privacyPolicy60") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy61") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy62") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy63") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy64") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy65") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy66") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy67") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy68") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy69") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy70") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy72") }}</p>
        <br />
        <p class="font-bold">{{ t("privacyAgreementText.privacyPolicy73") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy74") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy75_1") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy75_2") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy76") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy77") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy78") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy79") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy80") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy81") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy82") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy83") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy84_1") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy84_2") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy85") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy86") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy87") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy88") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy89") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy90") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy91") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy92") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy93") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy94") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy95_1") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy95_2") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy96") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy97") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy98") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy99") }}</p>
        <br />
        <p>{{ t("privacyAgreementText.privacyPolicy100") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy101") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy102") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy103") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy104") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy105") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy106") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy107") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy108") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy109") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy110") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy111") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy112") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy113") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy114") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy115") }}</p>
        <br />
        <p class="font-bold">
          {{ t("privacyAgreementText.privacyPolicy116") }}
        </p>
        <p>{{ t("privacyAgreementText.privacyPolicy117") }}</p>
        <p>{{ t("privacyAgreementText.privacyPolicy118") }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import { IMSDK } from "@/utils/imCommon";
import { feedbackToast } from "@/utils/common";
import useConversationSettings from "@/hooks/useConversationSettings";

const { t } = useI18n();
const router = useRouter();
const props = defineProps<{ isUserAgreement: boolean }>();

const title = props.isUserAgreement
  ? t("userAgreement")
  : t("privacyAgreement");
</script>

<style lang="scss" scoped></style>
