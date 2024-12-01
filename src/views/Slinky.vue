<script setup lang="ts">
import {
	Edge,
	Node,
	NodeTypesObject,
	VueFlow,
	useVueFlow,
} from "@vue-flow/core";
import useDragAndDrop from "../stores/useDnDStore";
import { useSlinkyStore } from "../stores/useSlinkyStore";
import DropzoneBackground from "../components/DropzoneBackground.vue";
import Sidebar from "../components/Sidebar.vue";
import SaveRestoreControls from "../components/Controls.vue";
import CustomTriggerNode from "../components/CustomTriggerNode.vue";
import CustomActionNode from "../components/CustomActionNode.vue";
import CustomConditionNode from "../components/CustomConditionNode.vue";
import CustomUtilitiesNode from "../components/CustomUtilitiesNode.vue";
import CustomDateTimeNode from "../components/CustomDateTimeNode.vue";
import { storeToRefs } from "pinia";
import Drawer from "../components/Drawer.vue";

const { onConnect, addNodes, addEdges } = useVueFlow();
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();
const { nodes, edges } = storeToRefs(useSlinkyStore());

const vueFlowNodes: Node[] = nodes.length === 0 ? [] : nodes;
const vueFlowEdges: Edge[] = edges.length === 0 ? [] : edges;

const customNodetypes: NodeTypesObject = {
	trigger: CustomTriggerNode,
	sendMessage: CustomActionNode,
	dateTimeConnector: CustomConditionNode,
	addComment: CustomUtilitiesNode,
	dateTime: CustomDateTimeNode,
};

onConnect(addEdges);
</script>

<template>
	<div class="dnd-flow-container" @drop="onDrop">
		<div class="dnd-flow">
			<VueFlow
				:nodes="vueFlowNodes"
				:edges="vueFlowEdges"
				:node-types="customNodetypes"
				@dragover="onDragOver"
				@dragleave="onDragLeave"
			>
				<SaveRestoreControls />
				<DropzoneBackground
					:style="{
						backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
						transition: 'background-color 0.2s ease',
					}"
				>
					<p v-if="isDragOver">Drop here</p>
				</DropzoneBackground>
			</VueFlow>
		</div>
		<Sidebar />
		<Drawer />
	</div>
</template>
