<template>
  <div class="absolute z-10 right-3 top-[23px] flex flex-col items-center">
    <span v-for="item in renderList.indexList" :key="item"
      class="my-0.5 cursor-pointer text-xs text-sub-text" @click="scrollToIndex(item)">{{ item }}</span>
  </div>
</template>

<script lang="ts" setup>
import useContactStore from '@/store/modules/contact';
import { formatContacts } from '@/utils/common';
import { FriendUserItem } from '@/utils/open-im-sdk-wasm/types/entity';

type IndexItem = {
  title: string,
  userID: string
}

type AlphabetIndexProps = {
  newList: (FriendUserItem | IndexItem)[]
}

const prosp = defineProps<AlphabetIndexProps>()

const emit = defineEmits<{
  (event: 'scrollToIndex', index: number): void
}>()

const contactStore = useContactStore()

const renderList = computed(() => formatContacts(contactStore.storeFriendList))

const scrollToIndex = (key: string) => {
  emit('scrollToIndex', prosp.newList.findIndex(item => (item as IndexItem).title === key))
}

// console.log(renderList.value.indexList)
</script>