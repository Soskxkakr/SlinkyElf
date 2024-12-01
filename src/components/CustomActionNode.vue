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
		:title="node.label || 'Send Message'"
		@click="selectNode(node)"
		style="border: 1px solid black; min-width: 250px; max-width: 300px"
	>
		<Handle
			type="source"
			:id="`source-${node.type}-${node.id}`"
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
			:id="`target-${node.type}-${node.id}`"
			:position="Position.Bottom"
			:style="{
				height: '16px',
				width: '6px',
				backgroundColor: 'black',
				filter: 'invert(100%)',
			}"
		/>
		<template #extra><Icon name="action" /></template>
		<a-timeline
			v-for="(item, index) in node.data?.data?.payload || []"
			:key="index"
		>
			<a-timeline-item color="green" v-show="item.type === 'text'">{{
				item.text
			}}</a-timeline-item>
			<a-timeline-item color="green" v-show="item.type === 'attachment'"
				><a-image :src="item.attachment" alt="Attachment Image" :width="100"
			/></a-timeline-item>
		</a-timeline>
		<a-typography-text
			v-show="node.data?.description"
			type="secondary"
			class="truncate-text"
			>{{ node.data?.description }}</a-typography-text
		>
	</a-card>
</template>
