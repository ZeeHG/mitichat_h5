<template>
	<div @click="toPreview" class="need_bg !bg-white border border-[#E8EAEF] w-[220px] !p-0">
		<div class="px-2.5 py-2 border-b border-solid border-b-[#E8EAEF]">
			<span class="break-words">{{ title }}</span>
		</div>
		<div class="flex flex-col px-2.5 py-0.5 text-xs text-sub-text">
			<text v-for="(item, idx) in message.mergeElem.abstractList" :key="idx" class="py-1 break-all">
				<span v-html="parseEmoji(item)"></span>
			</text>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { SessionType } from '@/utils/open-im-sdk-wasm/types/enum';
import { ExedMessageItem } from './data';
import { parseEmoji } from '@/utils/imCommon';

type MergeMessageRendererProps = {
	message: ExedMessageItem;
	disabled: boolean;
}

const props = defineProps<MergeMessageRendererProps>();
const router = useRouter();

const title = computed(() => {
	const sessionType = props.message.mergeElem.multiMessage[0].sessionType
	if (sessionType === SessionType.Single) {
		return props.message.senderNickname + props.message.mergeElem.title
	}
	return props.message.mergeElem.title
})

const toPreview = () => {
	if (props.disabled || !props.message.mergeElem.multiMessage) {
		return;
	}
	router.push({
		path: 'previewMergeMessage/' + Date.now(),
		state: {
			mergeData: JSON.stringify(props.message.mergeElem)
		}
	})
}

</script>

<style lang='scss' scoped></style>