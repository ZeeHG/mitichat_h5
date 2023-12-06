<template>
  <div class="page_container ">
    <NavBar :title="title" @leftClick="leftClick" :router="false">
      <div @click="tryRelease">发布</div>
    </NavBar>

    <div class="mt-[10px] !bg-white">
      <van-field v-model="text" rows="4" autosize type="textarea" maxlength="150" show-word-limit />
      <div class="mx-[10px] mb-[10px] w-[80px] h-[80px] relative"
        v-if="props.momentsType === MomentContentType.TextWithVideo && fileList.length > 0 && fileList[0].status !== 'uploading'"
        @click="showVideoPreview(fileList[0].original, fileList[0].thumb)">
        <img class="w-[80px] h-[80px] mx-1" :src="fileList[0].thumb" alt="">
        <img class=" absolute w-[36px] h-[36px] mx-1 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          :src="play_icon" alt="" />
      </div>
      <van-uploader v-else class="mx-[10px]" v-model="fileList" :after-read="afterRead" reupload :accept="accept"
        :maxCount="maxCount" />
    </div>

    <div class="mt-[10px] !bg-white">
      <SettingItem title="谁可以看" :sub-title="visibilityList[permission].title" border
        @click="router.push('/momentsVisibility')" />
      <SettingItem title="提醒谁看" @click="toSelectAtUser" :sub-title="atStr" isRemind />
    </div>
  </div>
</template>

<script name="momentsRelease" setup lang="ts" >
import NavBar from '@/components/NavBar/index.vue';
import { MomentContentType } from '@/types/moment'
import SettingItem from './SettingItem.vue'
import { IMSDK } from '@/utils/imCommon';
import { v4 as uuidV4 } from "uuid";
import emitter from '@/utils/events';
import { visibilityList } from '../visibilityList';
import { ContactChooseEnum } from '@/pages/contact/chooseUser/data';
import { GroupItem, PublicUserItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { publishMoment } from '@/api/moments';
import { feedbackToast, getPicInfo, getVideoSnshotFile } from '@/utils/common';
import play_icon from '@/assets/images/chating_message_video_play.png'
import showVideoPreview from '@/utils/showVideoPreview'

type MomentsReleaseProps = {
  momentsType: MomentContentType
}
const props = defineProps<MomentsReleaseProps>();
const router = useRouter();

const text = ref('')
const permission = ref(0)
const atUserIDs = ref<PublicUserItem[]>([])
const permissionUser = ref<PublicUserItem[]>([])
const permissionGroup = ref<GroupItem[]>([])
const fileList = ref<any[]>([]);

onMounted(() => {
  emitter.on('MOMENTS_UPDATE_PERMISSION', (str) => {
    const source = JSON.parse(str)
    permission.value = source.idx
    permissionUser.value = source.userList
    permissionGroup.value = source.groupList
  })
  emitter.on('MOMENTS_SELECT_AT_USER', (str) => {
    atUserIDs.value = JSON.parse(str)
  })
})

const atStr = computed(() => atUserIDs.value.map(item => item.nickname).join('、'))
const title = computed(() => props.momentsType === MomentContentType.TextWithImage ? '发布图文' : '发布视频')
const accept = computed(() => props.momentsType === MomentContentType.TextWithImage ? 'image/*' : 'video/*')
const maxCount = computed(() => props.momentsType === MomentContentType.TextWithImage ? 9 : 1);

const tryRelease = async () => {
  try {
    await publishMoment({
      content: {
        metas: fileList.value.map((item) => ({ thumb: item.thumb, original: item.original })),
        text: text.value,
        type: +props.momentsType,
      },
      permission: permission.value,
      atUserIDs: atUserIDs.value.map((user) => user.userID),
      permissionUserIDs: permissionUser.value.map(item => item.userID),
      permissionGroupIDs: permissionGroup.value.map(item => item.groupID),
    })
    init()
    router.back()
    emitter.emit('MOMENTS_RELEASE_INIT')
  } catch (error) {
    feedbackToast({ error })
  }
}

const afterRead = async (option: any) => {
  const fileData = option.file as File;
  option.status = 'uploading';
  option.message = '上传中...';
  option.thumb = '';

  const {
    data: { url },
  } = await IMSDK.uploadFile({
    name: fileData.name,
    contentType: fileData.type,
    uuid: uuidV4(),
    file: fileData,
  });
  let picFile = fileData;
  option.thumb = url;

  if (props.momentsType === MomentContentType.TextWithVideo) {
    picFile = await getVideoSnshotFile(fileData);

    const {
      data: { url },
    } = await IMSDK.uploadFile({
      name: picFile.name,
      contentType: picFile.type,
      uuid: uuidV4(),
      file: picFile,
    });
    option.thumb = url;
  }
  const { width, height } = await getPicInfo(picFile);

  option.message = '';
  option.status = 'done';
  option.original = url;
  option.width = width;
  option.height = height;

};

const toSelectAtUser = () => {
  router.push({
    path: 'chooseUser',
    state: {
      chooseType: ContactChooseEnum.MomentsUser,
      prevCheckedUserList: JSON.stringify(atUserIDs.value)
    }
  })
}

const leftClick = () => {
  init()
  router.back()
}

const init = () => {
  text.value = ''
  permission.value = 0
  atUserIDs.value = []
  permissionUser.value = []
  fileList.value = []
}

</script>

<style lang="scss" scoped>
:deep(.van-cell)::after {
  border-bottom: none;
}

:deep(.van-uploader__preview) {
  flex-grow: 1;
  margin-left: 4px;
  margin-right: 4px;
}

:deep(.van-uploader__upload) {
  flex-grow: 1;
  margin-left: 4px;
  margin-right: 4px;
}
</style>