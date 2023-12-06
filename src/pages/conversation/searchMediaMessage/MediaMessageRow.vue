<template>
  <div>
    <div class="m-2 text-[#333]">
      {{ title }}
    </div>
    <van-row gutter="6">
      <van-col class="relative" span="8" v-for="item in messages" :key="item.clientMsgID" @click="clickMediaItem(item)">
        <van-image height="121" width="100%" fit="cover" position="left"
          :src="isVideo ? item.videoElem.snapshotUrl : item.pictureElem.sourcePicture.url" />
        <img v-if="isVideo" :src="play_icon" width="24"
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" alt="">
      </van-col>
    </van-row>
  </div>
</template>

<script setup lang='ts'>
import play_icon from '@assets/images/chating_message_video_play.png'
import { MessageItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { MessageType } from '@/utils/open-im-sdk-wasm/types/enum';
import { showImagePreview } from 'vant';


const emit = defineEmits([]);
const props = defineProps<{ messages: MessageItem[], imgs: string[], title: string, isVideo: boolean }>();
const router = useRouter();

const clickMediaItem = (message: MessageItem) => {
  if (message.contentType === MessageType.VideoMessage) {
    router.push({
      path: '/previewVideo',
      query: {
        url: message.videoElem.videoUrl,
        poster: message.videoElem.snapshotUrl
      }
    })
  } else {
    const idx = props.imgs.findIndex(item => item === message.pictureElem.sourcePicture.url)
    showImagePreview({
      images: props.imgs,
      startPosition: idx > -1 ? idx : 0,
      closeable: true,
    })
  }
}

</script>

<style lang='scss' scoped></style>