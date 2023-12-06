<template>
  <div class="flex justify-start items-center h-[23px] pl-5 text-xs text-sub-text bg-[#E8EAEF]">
    {{ letterStr }}
  </div>
</template>

<script lang="ts" setup>

type LetterSection = {
  letterStr: string
}
defineProps<LetterSection>()

</script>