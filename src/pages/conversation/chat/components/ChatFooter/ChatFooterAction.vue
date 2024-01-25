<template>
  <div ref="target" class="bg-[#F0F2F6]">
    <van-grid class="px-3 py-3" :border="false" :column-num="4">
      <van-grid-item v-for="action in actionList" :key="action.type" clickable :icon="action.icon" :text="action.text"
        @click="clickAction(action)" />
    </van-grid>
    <van-uploader v-show="false" ref="uploaderRef" :accept="uploadChooseOptions.accept"
      :capture="uploadChooseOptions.capture" :preview-image="false" multiple max-count="9" :after-read="afterReadFile" />
    <van-action-sheet v-model:show="actionSheetVisible" teleport="body" :actions="actionSheetActions"
      @select="onActionSelect" />
    <div class="dac"></div>
    <van-popup v-model:show="showTranslatePicker" round position="bottom">
      <van-picker :columns="columns" @cancel="showTranslatePicker = false" @confirm="confirmTranslateConfig"
        v-model="targetLang">
        <template v-slot:columns-top>
          <div class="flex flex-col px-[16px] gap-2">
            <span>{{ t('footerAction.autoTranslate') }}</span>
            <van-switch v-model="checkedAutoTranslate" />
            <span>{{ t('targetLang') }}</span>
          </div>
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>

<script setup lang='ts'>
import image from '@/assets/images/chatFooter/image.png'
import camera from '@/assets/images/chatFooter/camera.png'
import call from '@/assets/images/chatFooter/call.png'
import file from '@/assets/images/chatFooter/file.png'
import card from '@/assets/images/chatFooter/card.png'
import location from '@/assets/images/chatFooter/location.png'
import autoTranslation from '@/assets/images/chatFooter/auto_translation.png'

import { onClickOutside } from '@vueuse/core'
import { ActionSheetAction, UploaderFileListItem, UploaderInstance, showLoadingToast } from 'vant'
import { ContactChooseEnum } from '@/pages/contact/chooseUser/data'
import { ToastWrapperInstance } from 'vant/lib/toast/types'
import useUserStore from '@/store/modules/user'
import useConversationStore from '@/store/modules/conversation'

const { t } = useI18n()
const showTranslatePicker = ref(false);
const checkedAutoTranslate = ref(false);
const targetLang = ref(["auto"]);
const conversationStore = useConversationStore();
const columns = [
  { text: t('lang.auto'), value: "auto" },
  { text: t('lang.English'), value: "English" },
  { text: t('lang.Spanish'), value: "Spanish" },
  { text: t('lang.French'), value: "French" },
  { text: t('lang.German'), value: "German" },
  { text: t('lang.Italian'), value: "Italian" },
  { text: t('lang.Portuguese'), value: "Portuguese" },
  { text: t('lang.Dutch'), value: "Dutch" },
  { text: t('lang.Russian'), value: "Russian" },
  { text: t('lang.Swedish'), value: "Swedish" },
  { text: t('lang.Polish'), value: "Polish" },
  { text: t('lang.Danish'), value: "Danish" },
  { text: t('lang.Norwegian'), value: "Norwegian" },
  { text: t('lang.Irish'), value: "Irish" },
  { text: t('lang.Greek'), value: "Greek" },
  { text: t('lang.Finnish'), value: "Finnish" },
  { text: t('lang.Czech'), value: "Czech" },
  { text: t('lang.Hungarian'), value: "Hungarian" },
  { text: t('lang.Romanian'), value: "Romanian" },
  { text: t('lang.Bulgarian'), value: "Bulgarian" },
  { text: t('lang.Slovak'), value: "Slovak" },
  { text: t('lang.Slovenian'), value: "Slovenian" },
  { text: t('lang.Estonian'), value: "Estonian" },
  { text: t('lang.Latvian'), value: "Latvian" },
  { text: t('lang.Lithuanian'), value: "Lithuanian" },
  { text: t('lang.Maltese'), value: "Maltese" },
  { text: t('lang.Icelandic'), value: "Icelandic" },
  { text: t('lang.Albanian'), value: "Albanian" },
  { text: t('lang.Croatian'), value: "Croatian" },
  { text: t('lang.Serbian'), value: "Serbian" },
  { text: t('lang.SimplifiedChinese'), value: "SimplifiedChinese" },
  { text: t('lang.TraditionalChinese'), value: "TraditionalChinese" },
  { text: t('lang.Japanese'), value: "Japanese" },
  { text: t('lang.Korean'), value: "Korean" },
  { text: t('lang.Arabic'), value: "Arabic" },
  { text: t('lang.Hindi'), value: "Hindi" },
  { text: t('lang.Bengali'), value: "Bengali" },
  { text: t('lang.Thai'), value: "Thai" },
  { text: t('lang.Vietnamese'), value: "Vietnamese" },
  { text: t('lang.Indonesian'), value: "Indonesian" },
  { text: t('lang.Malay'), value: "Malay" },
  { text: t('lang.Tamil'), value: "Tamil" },
  { text: t('lang.Urdu'), value: "Urdu" },
  { text: t('lang.Filipino'), value: "Filipino" },
  { text: t('lang.Persian'), value: "Persian" },
  { text: t('lang.Hebrew'), value: "Hebrew" },
  { text: t('lang.Turkish'), value: "Turkish" },
  { text: t('lang.Kannada'), value: "Kannada" },
  { text: t('lang.Malayalam'), value: "Malayalam" },
  { text: t('lang.Sindhi'), value: "Sindhi" },
  { text: t('lang.Punjabi'), value: "Punjabi" },
  { text: t('lang.Nepali'), value: "Nepali" },
  { text: t('lang.Swahili'), value: "Swahili" },
  { text: t('lang.Amharic'), value: "Amharic" },
  { text: t('lang.Zulu'), value: "Zulu" },
  { text: t('lang.Somali'), value: "Somali" },
  { text: t('lang.Hausa'), value: "Hausa" },
  { text: t('lang.Igbo'), value: "Igbo" },
  { text: t('lang.Yoruba'), value: "Yoruba" },
  { text: t('lang.Quechua'), value: "Quechua" },
  { text: t('lang.Guarani'), value: "Guarani" },
  { text: t('lang.Maori'), value: "Maori" },
  { text: t('lang.Esperanto'), value: "Esperanto" },
  { text: t('lang.Latin'), value: "Latin" },
]

type ChatFooterActionEmits = {
  (event: 'closeActionBar'): void;
  (event: 'getFile', uploadData: UploaderFileListItem): void;
}

enum ChatFooterActionType {
  Album,
  Shoot,
  VideoCall,
  File,
  IDCard,
  Location,
  AutoTranslation
}

type ChatFooterActionItem = {
  text: string;
  icon: string;
  type: ChatFooterActionType;
}

const actionList: ChatFooterActionItem[] = [
  {
    text: t('footerAction.album'),
    icon: image,
    type: ChatFooterActionType.Album,
  },
  {
    text: t('footerAction.shoot'),
    icon: camera,
    type: ChatFooterActionType.Shoot,
  },
  {
    text: t('footerAction.file'),
    icon: file,
    type: ChatFooterActionType.File,
  },
  {
    text: t('footerAction.idCard'),
    icon: card,
    type: ChatFooterActionType.IDCard
  },
  {
    text: t('footerAction.location'),
    icon: location,
    type: ChatFooterActionType.Location
  },
  {
    text: t('footerAction.autoTranslate'),
    icon: autoTranslation,
    type: ChatFooterActionType.AutoTranslation
  },
]

const albumActions = [
  {
    name: t('picture'),
    type: ChatFooterActionType.Album
  },
  {
    name: t('video'),
    type: ChatFooterActionType.Album
  },
] as unknown as ActionSheetAction[]

const shootActions = [
  {
    name: t('photograph'),
    type: ChatFooterActionType.Shoot
  },
  {
    name: t('recording'),
    type: ChatFooterActionType.Shoot
  }
] as unknown as ActionSheetAction[]

const router = useRouter();
const emit = defineEmits<ChatFooterActionEmits>();

const actionSheetVisible = ref(false)
const actionSheetActions = ref<ActionSheetAction[]>([])
const uploadChooseOptions = reactive({
  accept: '*',
  capture: undefined as any
})
const target = ref(null)
const uploaderRef = ref<UploaderInstance>()

let loadToast: ToastWrapperInstance | null = null;

onClickOutside(target, () => emit('closeActionBar'), {
  ignore: ['.van-overlay', '.van-action-sheet__content']
})

const onActionSelect = ({ type }: any, idx: number) => {
  uploadChooseOptions.accept = idx === 0 ? 'image/*' : 'video/*'
  if (type === ChatFooterActionType.Shoot) {
    uploadChooseOptions.capture = idx === 0 ? 'camera' : 'camcorder'
  }
  nextTick(() => uploaderRef.value?.chooseFile())
  actionSheetVisible.value = false;
}

const confirmTranslateConfig = async () => {
  showTranslatePicker.value = false;

  const ex = conversationStore.currentConversation.ex;
  const exJson = ex ? JSON.parse(ex) : {};
  exJson.langConfig = {
    autoTranslate: checkedAutoTranslate.value,
    targetLang: targetLang.value[0]
  };
  const exJsonStr = JSON.stringify(exJson);

  await conversationStore.setExConfigFromReq({
    conversationID: conversationStore.currentConversation.conversationID,
    conversationType: conversationStore.currentConversation.conversationType,
    userID: useUserStore().storeSelfInfo.userID,
    ex: exJsonStr
  });
}

const clickAction = ({ type }: ChatFooterActionItem) => {
  console.log(type);
  switch (type) {
    case ChatFooterActionType.Album:
      actionSheetActions.value = [...albumActions]
      actionSheetVisible.value = true
      break;
    case ChatFooterActionType.Shoot:
      actionSheetActions.value = [...shootActions]
      actionSheetVisible.value = true
      break;
    case ChatFooterActionType.File:
      uploadChooseOptions.accept = '*';
      uploadChooseOptions.capture = undefined;
      nextTick(() => uploaderRef.value?.chooseFile())
      break;
    case ChatFooterActionType.VideoCall:

      break;
    case ChatFooterActionType.IDCard:
      router.push({
        path: 'chooseUser',
        state: {
          chooseType: ContactChooseEnum.ChooseCard,
        }
      })
      break;
    case ChatFooterActionType.AutoTranslation:
      const config = conversationStore.getCurrentConversationExConfig();
      checkedAutoTranslate.value = !!config?.langConfig?.autoTranslate;
      targetLang.value = config?.langConfig?.targetLang ? [config?.langConfig?.targetLang] : ['auto'];
      showTranslatePicker.value = true;
      break;
    case ChatFooterActionType.Location:
      loadToast = showLoadingToast({
        message: t('messageTip.getLocation'),
        forbidClick: true,
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((p) => {
          console.log(p);
          loadToast?.close();
          loadToast = null;
          router.push({
            path: 'geolacationPage',
            state: {
              lng: p.coords.longitude,
              lat: p.coords.latitude
            }
          })
        }, (e) => {
          if (!loadToast) return;
          loadToast.message = t('messageTip.getLocationFailed');
          loadToast.close();
          loadToast = null;
        })
      }
      break;
    default:
      break;
  }
  // emit('closeActionBar')
}

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
  if (!Array.isArray(data)) {
    data = [data]
  }
  data.map(item => {
    emit('getFile', item)
  })
}

</script>

<style lang='scss' scoped>
:deep(.van-icon__image) {
  width: 48px;
  height: 48px;
  // background-color: #fff;
}

:deep(.van-grid-item__content) {
  background: none;
  padding: 6px 2px;
}
</style>