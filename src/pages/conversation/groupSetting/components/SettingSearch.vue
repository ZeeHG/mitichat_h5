<template>
  <div class="mt-2 mx-3 rounded-md overflow-hidden bg-white"
  :class="{ 'border-b border-[rgba(153,153,153,0.3)] last:border-0': border }">
    <div class="flex justify-between items-center px-4 py-3 bg-white "
      @click="clickAction">
      <div>{{ $t('chatRecord') }}</div>
       <div class="flex justify-between items-center "> 
        <div class="flex justify-between items-center text-[#999]">
         <img class="w-[24px] h-[24px]" :src="back" />
        </div>
       </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import text from '@assets/images/setting/text.png'
import image from '@assets/images/setting/image.png'
import video from '@assets/images/setting/video.png'
import file from '@assets/images/setting/file.png'
import back from '@assets/images/profile/back.png'

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

const clickAction=()=>{
  router.push('searchMessage')
}

</script>