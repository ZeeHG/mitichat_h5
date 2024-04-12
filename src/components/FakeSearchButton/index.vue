<template>
	<div class="fake-search-button">
		<span class="icon" />
		<span class="search-placeholder" v-if="props.placeholder">{{ props.placeholder }}</span>
	</div>
</template>

<script setup lang='ts'>
const props = defineProps<{
	placeholder: string
}>();
</script>

<style lang='scss' scoped>
.fake-search-button {
	padding: 7px 0;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border-radius: 18px;
	background-color: #ffffff;
	gap: 10px;

	.icon {
		width: 15px;
		height: 15px;
		background: url('@/assets/images/search.png') no-repeat center center/cover;
	}

	.search-placeholder {
		font-size: 16px;
		color: #999999;
		line-height: 22px;
	}
}
</style>