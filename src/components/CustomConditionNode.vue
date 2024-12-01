<script setup>
import { Handle, Position, useNode } from "@vue-flow/core";
import Icon from "./Icon.vue";

const { node } = useNode();
</script>

<template>
	<a-card
		size="small"
		:bordered="false"
		:bodyStyle="{ padding: '0', height: '0' }"
		style="border: 1px solid black; max-width: 200px"
	>
		<Handle
			type="source"
			:position="Position.Top"
			:style="{
				height: '16px',
				width: '6px',
				backgroundColor: 'black',
				filter: 'invert(100%)',
			}"
		/>
		<Handle
			type="target"
			:position="Position.Bottom"
			:style="{
				height: '16px',
				width: '6px',
				backgroundColor: 'black',
				filter: 'invert(100%)',
			}"
		/>
		<template #title>
			<span style="margin-right: 8px">{{ node.data.name }}</span>
			<Icon v-if="node.data.name === 'Success'" name="success" />
			<Icon v-else name="failure" />
		</template>
	</a-card>
</template>
