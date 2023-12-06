<template>
  <div class="flex justify-between items-center px-4 py-3 bg-white" :class="{ 'border-b': border }">
    <div class="flex items-center">
      <div class="w-[24px] h-[24px]">
        <img v-if="isSelect" class="w-[24px] h-[24px]" :src="select" />
      </div>

      <div class="flex flex-col items-start ml-3">
        <div>{{ title }}</div>
        <div class=" text-sm text-sub-text">{{ subTitle }}</div>
        <div class="text-primary text-sm">{{ selectList }}</div>
      </div>
    </div>


    <img v-if="arrow" class="w-[24px] h-[24px]" :src="back" />
  </div>
</template>

<script setup lang='ts'>
import back from '@assets/images/profile/back.png'
import select from '@assets/images/setting/select.png'

type SettingItemProps = {
  title: string;
  arrow?: boolean;
  isSelect?: boolean;
  border?: boolean;
  subTitle?: string;
  selectList?: string;
}
defineProps<SettingItemProps>();

</script>

<style lang='scss' scoped></style>
