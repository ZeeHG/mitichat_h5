<template>
  <iframe :src="userStore.storeAppConfig.discoverPageURL" frameborder="0"></iframe>
</template>

<script name="workbench" setup lang='ts'>
import useUserStore from '@/store/modules/user'

const userStore = useUserStore();

console.log(userStore.storeAppConfig.discoverPageURL)
</script>

<style lang='scss' scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>