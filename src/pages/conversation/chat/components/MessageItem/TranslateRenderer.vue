<template>
  <div class="text_content need_bg mt-1" v-html="content" v-if="content"></div>
  <template v-else>
    <img src="@/assets/images/messageItem/loading.gif" class="mt-1 h-[25px]" alt="" v-if="targetTranslate?.status === 'loading'">
    <div v-else />
  </template>
</template>

<script setup lang="ts">
import { formatLink, parseAt, parseBr, parseEmoji } from "@/utils/imCommon";
import { MessageType } from "@/utils/open-im-sdk-wasm/types/enum";
import { ExedMessageItem } from "./data";
import useMessageStore from "@/store/modules/message";

type TranslateRendererProps = {
  message: ExedMessageItem;
}

const { t } = useI18n()

const props = defineProps<TranslateRendererProps>();

const targetTranslate:any = computed(() => {
  const targetTranslate = useMessageStore().msgTranslate[props.message.clientMsgID];
  return targetTranslate;
})

const content = computed(() => {
  let content = '';
  const target = targetTranslate.value;
  if(target?.status === "show"){
    content = parseEmoji((parseBr(formatLink(props.message.contentType === MessageType.AtTextMessage? parseAt({
      ...props.message.atTextElem,
      text: target[target.targetLang]
    }) : target[target.targetLang]))));
  }else if(target?.status === "fail"){
    content = t('translateFail');
  }
  return content;
});
</script>

<style lang="scss" scoped>
.text_content {
  word-break: break-all;
  word-wrap: break-word;

  :deep(.emoji_el) {
    padding-right: 2px;
    vertical-align: sub;
    width: 24px;
  }
}
</style>
