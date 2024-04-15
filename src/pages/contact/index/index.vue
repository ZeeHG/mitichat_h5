<template>
  <div class="page_container">
    <div class="relative">
      <div
        class="('@/assets/images/conversation/header_bg.png')] bg-cover bg-bottom z-10 absolute w-full h-[183px] pointer-events-none" />
      <ConversationHeader :tabIndex="1"/>
      <ContactMenuList />
      <!-- <ContactFrequentList /> -->
    </div>
  </div>

  <!-- <div class="h-full flex flex-col bg-[#F7F8FA]">
    <div class="relative">
      <div
        class="bg-[url('@/assets/images/conversation/header_bg.png')] bg-cover bg-bottom z-10 absolute w-full h-[183px] pointer-events-none">
      </div>
      <ConversationHeader />
      <van-search background="transparent" readonly :placeholder="$t('placeholder.search')" @click-input="clickInput" />
    </div>
    <ConversationList />
  </div> -->
</template>

<script name="contact" setup lang='ts'>
// import ContactHeader from './components/ContactHeader.vue';
import ConversationHeader from '@pages/conversation/index/components/ConversationHeader.vue';
import ContactMenuList from './components/ContactMenuList.vue';
// import ContactFrequentList from './components/ContactFrequentList.vue';

const emit = defineEmits([]);
const props = defineProps({});

</script>

<style lang='scss' scoped></style>