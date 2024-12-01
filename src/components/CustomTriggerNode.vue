<script setup>
import { Handle, Position, useNode } from "@vue-flow/core";
import Icon from "./Icon.vue";
import { useSlinkyStore } from "../stores/useSlinkyStore";

const { selectNode } = useSlinkyStore();
const { node } = useNode();
</script>

<template>
	<a-card
		size="small"
		:bordered="false"
		title="Start"
		@click="selectNode(node)"
		style="border: 1px solid black; max-width: 200px"
	>
		<Handle
			type="target"
			:position="Position.Bottom"
			id="test"
			:style="{
				height: '16px',
				width: '6px',
				backgroundColor: 'black',
				filter: 'invert(100%)',
			}"
		/>

		<template #extra><Icon name="trigger" /></template>
		<span>Conversation Started</span>
	</a-card>
</template>
