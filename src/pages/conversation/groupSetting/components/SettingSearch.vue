<template>
  <div class="bg-white mt-2 mx-3 rounded-md overflow-hidden">
    <div class=" text-sm text-sub-text ml-4 mt-4">{{ $t('chatRecord') }}</div>
    <div class="flex justify-between mt-2 mb-4 mx-5">
      <div class="flex flex-col items-center" v-for="action in searchRowActions" :key="action.type"
        @click="clickAction(action.type)">
        <img width="24" :src="action.icon" alt="">
        <span class="mt-2 text-xs text-[#666]">{{ action.text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import text from '@assets/images/setting/text.png'
import image from '@assets/images/setting/image.png'
import video from '@assets/images/setting/video.png'
import file from '@assets/images/setting/file.png'

const router = useRouter()
const { t } = useI18n()

enum SearchLocalMessageEnum {
  Nomal,
  Image,
  Video,
  File,
}

const searchRowActions = [
  {
    text: t('placeholder.search'),
    type: SearchLocalMessageEnum.Nomal,
    icon: text
  },
  {
    text: t('picture'),
    type: SearchLocalMessageEnum.Image,
    icon: image
  },
  {
    text: t('video'),
    type: SearchLocalMessageEnum.Video,
    icon: video
  },
  {
    text: t('documnet'),
    type: SearchLocalMessageEnum.File,
    icon: file
  },
]

const clickAction = (type: SearchLocalMessageEnum) => {
  switch (type) {
    case SearchLocalMessageEnum.Nomal:
      router.push('searchMessage')
      break;
    case SearchLocalMessageEnum.Image:
    case SearchLocalMessageEnum.Video:
      router.push({
        path: 'searchMediaMessage',
        query: {
          isVideo: (type === SearchLocalMessageEnum.Video) + ''
        }
      })
      break;
    case SearchLocalMessageEnum.File:
      router.push('searchFileMessage')
      break;
    default:
      break;
  }
}
</script>