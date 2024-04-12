<template>
  <div class="h-full flex flex-col bg-[#F7F8FA]">
    <div class="relative">
      <div
        class="bg-[url('@/assets/images/conversation/header_bg.png')] bg-cover bg-bottom z-10 absolute w-full h-[183px] pointer-events-none">
      </div>
      <ConversationHeader :tabIndex="0" />
      <FakeSearchButton class="mx-3 mb-3" @click="clickInput" :placeholder="$t('placeholder.search')" />
    </div>
    <ConversationList />
  </div>
</template>

<script name="conversation" setup lang='ts'>
import ConversationHeader from "./components/ConversationHeader.vue";
import ConversationList from "./components/ConversationList.vue";
import FakeSearchButton from "@components/FakeSearchButton/index.vue";

const emit = defineEmits([]);
const props = defineProps();

const router = useRouter();

const clickInput = () => {
  router.push('globalSearch')
}

</script>

<style lang='scss' scoped>
</style>