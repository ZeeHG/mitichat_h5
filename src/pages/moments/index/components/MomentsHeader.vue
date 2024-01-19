<template>
  <div>
    <van-nav-bar :title="$t('workbench')" placeholder fixed left-arrow :clickable="false" :border="false"
      @click-left="router.back()">
      <template #left>
        <img class="w-3 h-5" :src="arrows" alt="" />
      </template>

      <template #right>
        <div class="flex">
          <img class="w-6 h-6 mr-2" :src="message" alt="" @click="router.push('/interactiveMessage')" />
          <van-popover placement="bottom-end" :show-arrow="false" v-model="show" :actions="momentsMoreActions"
            @select="onSelect">
            <template #reference>
              <img class="w-6 h-6" :src="publish" alt="" @click="show = true" />
            </template>
          </van-popover>
        </div>
      </template>
    </van-nav-bar>
  </div>
</template>

<script setup lang='ts'>
import arrows from '@/assets/images/moments/back.png'
import message from '@/assets/images/moments/message.png'
import publish from '@/assets/images/moments/publish.png'
import image from '@/assets/images/moments/image.png'
import video from '@/assets/images/moments/video.png'
import { MomentContentType } from '@/types/moment'

const router = useRouter();

const momentsMoreActions = [
  {
    idx: MomentContentType.TextWithImage,
    text: '发布图文',
    icon: image,
  },
  {
    idx: MomentContentType.TextWithVideo,
    text: '发布视频',
    icon: video,
  },
];

const show = ref(false);

const onSelect = (action: typeof momentsMoreActions[0]) => {
  router.push({
    path: '/momentsRelease',
    query: {
      momentsType: action.idx
    }
  })
};

</script>

<style lang='scss' scoped>
:deep(.van-nav-bar) {
  background-image: url(@/assets/images/moments/background.png);
  background-position: top;
  background-size: cover;
}

:deep(.van-nav-bar__title) {
  color: white;
}

:deep(.van-icon__image) {
  width: 16px;
  height: 16px;
}
</style>