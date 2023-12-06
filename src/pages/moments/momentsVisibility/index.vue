<template>
  <div class="page_container ">
    <NavBar :title="'谁可以看'">
      <div @click="tryRelease">确定</div>
    </NavBar>

    <div class="mt-[10px] !bg-white">
      <SettingItem v-for="item in visibilityList" :title="item.title" :sub-title="item.subTitle" :border="item.border"
        :arrow="item.arrow" :isSelect="item.idx === currentIndex" @click="changeCurrentIndex(item.idx)"
        :selectList="item.idx === currentIndex ? userStr : ''" />
    </div>
  </div>
</template>

<script setup lang="ts" name="momentsVisibility">
import NavBar from '@/components/NavBar/index.vue';
import SettingItem from './SettingItem.vue'
import emitter from '@/utils/events';
import { visibilityList } from '../visibilityList';
import { GroupItem, PublicUserItem } from '@/utils/open-im-sdk-wasm/types/entity';
import { ContactChooseEnum } from '@/pages/contact/chooseUser/data';

const router = useRouter();

const currentIndex = ref(0)
const permissionUser = ref<PublicUserItem[]>([])
const permissionGroup = ref<GroupItem[]>([])
const userStr = computed(() => {
  if (currentIndex.value > 1) {
    const groupList = permissionGroup.value.map(item => item.groupName)
    const userList = permissionUser.value.map(item => item.nickname)
    return [...userList, ...groupList].join('、')
  }
  return ''
})

onMounted(() => {
  emitter.on('MOMENTS_SELECT_PERMISSION_USER', (str) => {
    const source = JSON.parse(str)
    permissionGroup.value = source.groupList
    permissionUser.value = source.userList
  })
  emitter.on('MOMENTS_RELEASE_INIT', () => {
    init()
  })
})

const tryRelease = () => {
  emitter.emit('MOMENTS_UPDATE_PERMISSION', JSON.stringify({ idx: currentIndex.value, userList: permissionUser.value, groupList: permissionGroup.value }))
  router.back()
}

const init = () => {
  currentIndex.value = visibilityList[0].idx
  permissionUser.value = []
  permissionGroup.value = []
}

const changeCurrentIndex = (idx: number) => {
  if (idx !== currentIndex.value) {
    permissionUser.value = []
  }
  currentIndex.value = idx
  if (idx > 1) {
    router.push({
      path: 'chooseUser',
      state: {
        chooseType: ContactChooseEnum.MomentsPermissionUser,
        prevCheckedUserList: JSON.stringify([...permissionUser.value, ...permissionUser.value])
      }
    })
  } else {
    permissionUser.value = []
  }
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