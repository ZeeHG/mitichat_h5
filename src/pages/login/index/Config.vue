<template>
  <van-overlay :show="show">
    <div class="page_container !bg-white">
      <NavBar :title="''" :router="false" @leftClick="emit('close')" />
      <van-tabs v-model:active="active" @change="onChange">
        <van-tab title="ip"></van-tab>
        <van-tab title="http"></van-tab>
      </van-tabs>
      <van-form @submit="onSubmit" class="mt-10 px-5">
        <van-cell-group inset>
          <div class="border border-gap-text rounded-lg mt-4">
            <van-field v-model="config.ws" name="ws" label="ws:" />

          </div>
          <div class="border border-gap-text rounded-lg mt-4">
            <van-field v-model="config.api" name="api" label="api:" />

          </div>
          <div class="border border-gap-text rounded-lg mt-4">
            <van-field v-model="config.chat" name="chat" label="chat:" />
          </div>
        </van-cell-group>
        <div class="mt-4 mx-auto w-[120px]">
          <van-button round block type="primary" native-type="submit">
            save
          </van-button>
        </div>
      </van-form>
    </div>
  </van-overlay>
</template>

<script lang="ts" setup>
import { getApiUrl, getChatUrl, getWsUrl } from '@/utils/storage';

type ConfigProps = {
  show: boolean;
};

defineProps<ConfigProps>();
const emit = defineEmits(['close'])

const active = ref(0);

const config = reactive({
  ws: '',
  api: '',
  chat: ''
})

onMounted(() => {
  onChange(0)
})

const onChange = (name: number) => {
  if (name === 0) {
    if (getApiUrl().includes('10001')) {
      config.ws = getWsUrl()
      config.api = getApiUrl()
      config.chat = getChatUrl()
    } else {
      config.ws = 'ws://10.10.10.10:10001'
      config.api = 'http://10.10.10.10:10002'
      config.chat = 'http://10.10.10.10:10008'
    }

  } else {
    if (getApiUrl().includes('https')) {
      config.ws = getWsUrl()
      config.api = getApiUrl()
      config.chat = getChatUrl()
    } else {
      config.ws = 'wss://domain/msg_gateway'
      config.api = 'https://domain/api'
      config.chat = 'https://domain/chat'
    }
  }
}

const onSubmit = (values: any) => {
  localStorage.setItem("wsUrl", values.ws);
  localStorage.setItem("apiUrl", values.api);
  localStorage.setItem("chatUrl", values.chat);
  emit('close')
  window.location.reload()
};

</script>

<style scoped lang="scss">
:deep(.van-field__label) {
  width: 34px;
}
</style>