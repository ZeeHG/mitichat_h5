<template>
  <div class="h-full flex flex-col">
    <ConversationHeader />
    <van-search background="#fff" readonly :placeholder="$t('placeholder.search')" @click-input="clickInput" />
    <ConversationList />
  </div>
</template>

<script name="conversation" setup lang='ts'>
import ConversationHeader from "./components/ConversationHeader.vue";
import ConversationList from "./components/ConversationList.vue";

const emit = defineEmits([]);
const props = defineProps();

const router = useRouter();

const clickInput = () => {
  router.push('globalSearch')
}

</script>

<style lang='scss' scoped>
:deep(.van-search) {
  padding-top: 0 !important;
}
</style>