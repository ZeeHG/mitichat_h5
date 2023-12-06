<template>
  <div class="flex-1 overflow-y-auto">
    <div v-show="data.contacts.length > 0" class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
      <div class="flex justify-between px-4 pt-2 text-xs">
        <text class="text-sm text-sub-text">{{ $t('contactMenu.contacts') }}</text>
      </div>
      <global-search-result v-for="user in data.contacts.slice(0, 2)" :source="(user as any)" :key="user.userID" />
      <DetailInfoItem class=" border-t text-primary pl-4" arrow :lable="$t('moreContacts')" @click="$emit('toggleTab', 1)" />
    </div>

    <div v-show="data.groups.length > 0" class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
      <div class="flex justify-between px-4 pt-2 text-xs">
        <text class="text-sm text-sub-text">{{ $t('group') }}</text>
      </div>
      <global-search-result v-for="group in data.groups.slice(0, 2)" :source="(group as any)" :key="group.groupID" />
      <DetailInfoItem class=" border-t text-primary pl-4" arrow :lable="$t('moreGroup')" @click="$emit('toggleTab', 2)" />
    </div>

    <div v-show="data.chatLogs.length > 0" class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden">
      <div class="flex justify-between px-4 pt-2 text-xs">
        <text class="text-sm text-sub-text">{{ $t('chatRecord') }}</text>
      </div>
      <global-search-result v-for="logs in data.chatLogs.slice(0, 2)" :source="(logs as any)" :key="logs.conversationID"
        @click="$emit('checkConversation', logs)" />
      <DetailInfoItem class=" border-t text-primary pl-4" arrow :lable="$t('moreChatRecord')" @click="$emit('toggleTab', 3)" />
    </div>

    <div v-show="data.documents.length > 0" class="bg-white mt-[10px] mx-[10px] rounded-md overflow-hidden mb-4">
      <div class="flex justify-between px-4 pt-2 text-xs">
        <text class="text-sm text-sub-text">{{ $t('documentation') }}</text>
      </div>
      <global-search-result v-for="document in data.documents.slice(0, 2)" :source="(document as any)"
        :key="document.clientMsgID" :isFile="true" />
      <DetailInfoItem class=" border-t text-primary pl-4" arrow :lable="$t('moreDocumnet')" @click="$emit('toggleTab', 4)" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { GlobalDataSource } from './data';
import GlobalSearchResult from './GlobalSearchResult.vue';
import DetailInfoItem from '@/components/DetailInfoItem/index.vue';

const emit = defineEmits(['toggleTab', 'checkConversation']);
const props = defineProps<{ data: GlobalDataSource }>();

</script>

<style lang='scss' scoped></style>