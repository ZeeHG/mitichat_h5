<template>
  <div class="flex justify-between items-center px-4 py-3 bg-white" :class="{ 'border-b': border }">
    <div class="flex items-center">
      <img class="w-5 h-5" :src="isRemind ? remind : authority" alt="">
      <div class="ml-2">{{ title }}</div>
    </div>

    <div class="flex justify-between items-center">
      <div class="flex justify-between items-center text-[#999]">
        <slot>
          <div>{{ subTitle }}</div>
        </slot>

        <img class="w-[24px] h-[24px]" :src="back" />
      </div>

    </div>
  </div>
</template>

<script setup lang='ts'>
import back from '@assets/images/profile/back.png'
import authority from '@assets/images/moments/authority.png'
import remind from '@assets/images/moments/remind.png'

type SettingItemProps = {
  title: string;
  border?: boolean;
  subTitle?: string;
  isRemind?: boolean;
}
defineProps<SettingItemProps>();
</script>

<style lang='scss' scoped></style>
