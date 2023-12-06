<template>
	<div class="flex justify-center items-center w-[220px] h-[64px] !bg-white border rounded-md border-[#E8EAEF]">
		<div @click="toPreviewFile" class="flex flex-col mr-3 flex-1 max-w-[140px]">
			<text class="truncate">{{ message.fileElem.fileName }}</text>
			<text class="text-xs text-[#999]">{{ fileSizeStr }}</text>
		</div>
		<img class="w-[38px] h-[44px]" :src="zip" alt="" />
	</div>
</template>

<script setup lang='ts'>
import zip from '@assets/images/messageItem/zip.png'
import { bytesToSize, downloadFile } from '@/utils/common';
import { ExedMessageItem } from './data';

type FileMessageRendererProps = {
	message: ExedMessageItem;
	disabled: boolean;
}

const props = defineProps<FileMessageRendererProps>();
const router = useRouter()

const fileSizeStr = bytesToSize(props.message.fileElem.fileSize)


const toPreviewFile = () => {
	if (props.disabled) {
		return;
	}
  downloadFile(props.message.fileElem.sourceUrl,props.message.fileElem.fileName)
}
</script>

<style lang='scss' scoped></style>