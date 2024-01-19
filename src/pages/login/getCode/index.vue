<template>
  <div class="page_container px-10 relative">
    <img class="w-6 h-6 mt-[5vh]" :src="login_back" alt="" @click="$router.back">

    <div class="text-2xl text-primary font-semibold my-12">{{ isRegiste ? $t('register') : $t('forgetPasswordTitle') }}
    </div>

    <van-form @submit="onSubmit">
      <div v-if="!isByEmail">
        <div class="text-sm mb-1 text-sub-text">{{ $t('cellphone') }}</div>
        <div class="border border-gap-text rounded-lg flex items-center">
          <div class="flex items-center border-r border-gap-text px-3" @click="showAreaCode = true">
            <span class="mr-1">{{ formData.areaCode }}</span>
            <van-icon name="arrow-down" />
          </div>
          <van-field class="!py-1 !text-base" clearable v-model="formData.phoneNumber" name="phoneNumber" type="number"
            :placeholder="$t('placeholder.inputPhoneNumber')" />
        </div>
      </div>

      <div v-else>
        <div class="text-sm mb-1 text-sub-text">{{ $t('email') }}</div>
        <div class="border border-gap-text rounded-lg">
          <van-field class="!py-1" clearable v-model="formData.email" name="email"
            :placeholder="$t('placeholder.inputEmail')" />
        </div>
      </div>

      <div class="mt-5" v-if="isRegiste">
        <div class="text-sm mb-1 text-sub-text">{{ $t('invitationCode') }}</div>
        <div class="border border-gap-text rounded-lg">
          <van-field class="!py-1" clearable v-model="formData.invitationCode" name="invitationCode" type="text"
            :placeholder="`${$t('placeholder.inputInvitationCode')}${needInvitationCode ? '' : `(${$t('optional')})`}`">
          </van-field>
        </div>
      </div>

      <div class="mt-5" v-else>
        <div class="text-sm mb-1 text-sub-text">{{ $t('reAcquireDesc') }}</div>
        <div class="border border-gap-text rounded-lg">
          <van-field class="!py-1" clearable v-model="formData.verificationCode" name="verificationCode" type="text"
            :placeholder="$t('placeholder.inputVerificationCode')">
            <template #button>
              <span class="text-primary" @click="reSend" v-if="count <= 0">{{ $t('buttons.verificationCode') }}</span>
              <span class="text-primary" v-else>{{ count }}S</span>
            </template>
          </van-field>
        </div>
      </div>

      <div class="mt-28">
        <van-button block type="primary" native-type="submit">
          {{ $t('buttons.next') }}
        </van-button>
      </div>

    </van-form>

    <van-popup v-model:show="showAreaCode" round position="bottom">
      <van-picker :columns="countryCodeList" @cancel="showAreaCode = false" @confirm="onConfirmAreaCode"
        :columns-field-names="{ text: 'phone_code', value: 'phone_code', children: 'children' }">
        <template v-slot:columns-top>
          <div class="border border-gap-text rounded-lg mx-4 mt-2 overflow-hidden px-[10px]">
            <input type="text" v-model="countryCodeInput" class="h-[32px] w-full">
          </div>
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>

<script setup lang='ts'>
import type { PickerConfirmEventParams, } from 'vant';
import { UsedFor } from '@/api/data';
import { sendSms } from '@/api/login';
import useUserStore from '@/store/modules/user'
import countryCode from '@/utils/areaCode'
import { feedbackToast } from '@/utils/common';
import login_back from '@assets/images/login_back.png'

const phoneRegExp = /^1[3-9]\d{9}$/
const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const { t } = useI18n()
const userStore = useUserStore();
const router = useRouter();

const props = defineProps<{ isRegiste: boolean, isByEmail: boolean }>()
const formData = reactive({
  email: '',
  phoneNumber: '',
  areaCode: '+1',
  invitationCode: '',
  accept: true,
  verificationCode: ''
})
const showAreaCode = ref(false)
const count = ref(0)
let timer: NodeJS.Timer
const countryCodeInput = ref('');

const needInvitationCode = computed(() => !!userStore.storeAppConfig.needInvitationCodeRegister)
const countryCodeList: any = computed(() => countryCode.filter((item: any) => item.phone_code.includes(countryCodeInput.value)));

const onSubmit = () => {
  if (!props.isByEmail && !phoneRegExp.test(formData.phoneNumber)) {
    feedbackToast({
      message: t('messageTip.correctPhoneNumber'),
      error: t('messageTip.correctPhoneNumber')
    })
    return
  }
  if (props.isByEmail && !emailRegExp.test(formData.email)) {
    feedbackToast({
      message: t('messageTip.correctEmail'),
      error: t('messageTip.correctEmail'),
    })
    return
  }
  if (needInvitationCode && formData.invitationCode) {
    feedbackToast({
      message: t('messageTip.invitationCode'),
      error: t('messageTip.invitationCode')
    })
    return
  }
  sendSms({
    phoneNumber: formData.phoneNumber,
    areaCode: formData.areaCode,
    email: formData.email,
    usedFor: props.isRegiste ? UsedFor.Register : UsedFor.Modify
  })
    .then(() => {
      console.log(props.isByEmail)
      if (props.isRegiste) {
        router.push({
          path: 'verifyCode',
          query: {
            baseData: JSON.stringify({
              ...formData,
              isRegiste: props.isRegiste,
              isByEmail: props.isByEmail
            })
          }
        })
      } else {
        router.push({
          path: 'setPassword',
          query: {
            baseData: JSON.stringify({
              ...formData,
              isRegiste: props.isRegiste,
              isByEmail: props.isByEmail
            })
          }
        })
      }
    })
    .catch(error => feedbackToast({ message: t('messageTip.sendCodeFailed'), error }))
}

const onConfirmAreaCode = ({ selectedValues }: PickerConfirmEventParams) => {
  console.log(countryCodeList.value.length, selectedValues)
  formData.areaCode = countryCodeList.value.length? String(selectedValues[0]) : formData.areaCode;
  showAreaCode.value = false
}

const reSend = () => {
  if (count.value > 0) return
  sendSms({
    phoneNumber: formData.phoneNumber,
    email: formData.email,
    areaCode: formData.areaCode,
    usedFor: UsedFor.Login
  })
    .then(startTimer)
    .catch(error => feedbackToast({ message: t('messageTip.sendCodeFailed'), error }))
}

const startTimer = () => {
  if (timer) {
    clearInterval(timer)
  }
  count.value = 60
  timer = setInterval(() => {
    if (count.value > 0) {
      count.value -= 1
    } else {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style lang='scss' scoped>
.page_container {
  background: linear-gradient(180deg, rgba(0, 137, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}
</style>