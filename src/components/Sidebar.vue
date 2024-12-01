<script setup>
import useDragAndDrop from "../stores/useDnDStore";
import jsonData from "../data/nodes.json";
import NodeCard from "./NodeCard.vue";
import { useSlinkyStore } from "../stores/useSlinkyStore";

const { resetSelectedNode } = useSlinkyStore();
const { onDragStart } = useDragAndDrop();
</script>

<template>
	<aside @click="resetSelectedNode">
		<a-typography-title :level="2">Slinky Elf</a-typography-title>
		<div
			class="nodes"
			v-for="node in jsonData"
			:key="node.id"
			:draggable="true"
			@dragstart="onDragStart($event, node)"
		>
			<NodeCard :node="node" />
		</div>
	</aside>
</template>
