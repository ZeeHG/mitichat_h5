<template>
  <div class="flex items-center px-[22px] py-4 header justify-between">
    <Avatar :size="40" :src="userStore.storeSelfInfo.faceURL" :desc="userStore.storeSelfInfo.nickname" />
    <van-tabs :active="active" @change="changeTab">
      <van-tab>
        <template #title>
          {{ $t('chat') }}
        </template>
      </van-tab>
      <van-tab>
        <template #title>
          <van-badge :content="unHandleApplicationCount" :show-zero="false">
            {{ $t('contact') }}
          </van-badge>
        </template>
      </van-tab>
    </van-tabs>
    <div class="flex pl-[24px]">
      <!-- <img :src="call" alt="call" width="24" class="mr-2" /> -->
      <van-popover :show-arrow="false" v-model:show="showPopover" :actions="conversationTopMoreActions"
        placement="bottom-end" @select="selectMenu">
        <template #reference>
          <img :src="add" alt="add" width="24" />
        </template>
      </van-popover>
    </div>
  </div>
</template>

<script setup lang='ts'>
import add_friend from "@/assets/images/conversation/add_friend.png";
import add_group from "@/assets/images/conversation/add_group.png";
import scan from "@/assets/images/conversation/scan.png";
import create_group from "@/assets/images/conversation/create_group.png";
import Avatar from '@/components/Avatar/index.vue';
import add from '@/assets/images/conversation/add.png'
import loading from '@/assets/images/conversation/loading.png'
import sync_error from '@assets/images/conversation/sync_error.png'
import { PopoverAction } from 'vant';
import useUserStore from '@/store/modules/user';
import { IMSDK } from '@/utils/imCommon';
import { CbEvents } from '@/utils/open-im-sdk-wasm/constant';
import { GroupType } from '@/utils/open-im-sdk-wasm/types/enum';
import useContactStore from "@/store/modules/contact";

enum ActionEnum {
  Scan,
  AddFriend,
  AddGroup,
  LaunchGroup
}

enum connectStateEnum {
  Loading,
  Success,
  Failed
}

type ConversationTabIndex = {
  tabIndex: number;
}

const props = defineProps<ConversationTabIndex>();

const { t, locale } = useI18n();
const active = props.tabIndex;
const contactStore = useContactStore();

const unHandleApplicationCount = computed(() => contactStore.unHandleFriendApplicationNum + contactStore.unHandleGroupApplicationNum)

const changeTab = (name: string | number, title: string) => {
  if (name == 1) {
    router.push({
      name: "Contact"
    });
  } else {
    router.push({
      name: "Conversation"
    });
  }
}

const conversationTopMoreActions: PopoverAction[] = [
  {
    text: t("scanQr"),
    icon: scan,
  },
  {
    text: t("addFriend"),
    icon: add_friend,
  },
  {
    text: t("addGroup"),
    icon: add_group,
  },
  {
    text: t("launchGroup"),
    icon: create_group,
  },
];


watch(locale, () => {
  conversationTopMoreActions[0].text = t("scanQr");
  conversationTopMoreActions[1].text = t("addFriend");
  conversationTopMoreActions[2].text = t("addGroup");
  conversationTopMoreActions[3].text = t("launchGroup");
});

const userStore = useUserStore()
const router = useRouter()

const showPopover = ref(false)
const connectState = ref(connectStateEnum.Success)

const setConnectLoading = () => connectState.value = connectStateEnum.Loading
const setConnectSuccess = () => connectState.value = connectStateEnum.Success
const setConnectFailed = () => connectState.value = connectStateEnum.Failed

onMounted(() => {
  IMSDK.on(CbEvents.OnConnecting, setConnectLoading);
  IMSDK.on(CbEvents.OnConnectSuccess, setConnectSuccess);
  IMSDK.on(CbEvents.OnConnectFailed, setConnectFailed);
})

onBeforeUnmount(() => {
  IMSDK.off(CbEvents.OnConnecting, setConnectLoading);
  IMSDK.off(CbEvents.OnConnectSuccess, setConnectSuccess);
  IMSDK.off(CbEvents.OnConnectFailed, setConnectFailed);
})

const selectMenu = (_: PopoverAction, idx: ActionEnum) => {
  switch (idx) {
    case ActionEnum.Scan:
      router.push('scanPage')
      break;
    case ActionEnum.AddFriend:
    case ActionEnum.AddGroup:
      router.push({
        path: 'searchToJoin',
        query: {
          isGroup: String(idx === ActionEnum.AddGroup)
        }
      })
      break;
    case ActionEnum.LaunchGroup:
      router.push({
        path: 'createGroup',
        query: {
          groupType: GroupType.WorkingGroup
        }
      })
      break;
    default:
      break;
  }
}
</script>

<style lang='scss' scoped>
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading {
  animation: loading 1.5s infinite;
}

:deep(.van-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;

  --van-tabs-bottom-bar-width: 20px;

  .van-tabs__wrap {
    min-height: var(--van-tabs-line-height);
    overflow: visible;
  }

  .van-tab__text{
    overflow: visible;
  }

  .van-tabs__nav {
    background-color: transparent;
    gap: 15px;
  }

  .van-tabs__content {
    flex: 1;
    overflow: hidden;

    .van-tab__panel {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>