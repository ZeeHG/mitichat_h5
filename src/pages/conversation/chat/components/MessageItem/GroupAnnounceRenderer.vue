<template>
	<div class="need_bg w-[220px] !bg-white border border-[#E8EAEF]">
		<div class="flex items-center">
			<img class="mr-2 w-6 h-6" :src="announce" />
			<span class="text-primary">{{ $t('popover.groupAnnouncement') }}</span>
		</div>
		<div class="mt-2 text-sm break-all">
			{{ announceContent }}
		</div>
	</div>
</template>

<script setup lang='ts'>
import announce from '@assets/images/messageItem/announce.png'

type GroupAnnounceRendererProps = {
	announceContent: string;
}

const props = defineProps<GroupAnnounceRendererProps>();

</script>

<style lang='scss' scoped></style>