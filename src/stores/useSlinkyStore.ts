// stores/useDragStore.ts
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import {
	FlowExportObject,
	GraphNode,
	type Edge,
	type Node,
} from "@vue-flow/core";
import { message } from "ant-design-vue";

export type SlinkyNode = {
	name?: string;
	id: string;
	type: string;
	data: {
		payload?: {
			type: string;
			text?: string;
			attachment?: string;
		}[];
		type?: string;
		oncePerContact?: boolean;
		times?: {
			startTime: string;
			endTime: string;
			day: string;
		}[];
		connectors?: string[];
		timezone?: string;
		action?: string;
		connectorType?: string;
		comment?: string;
	};
	parentId: string;
};

export const useSlinkyStore = defineStore("slinky-flow", () => {
	const nodes = ref<Node[]>([]);
	const edges = ref<Edge[]>([]);
	const selectedNode = ref<GraphNode | SlinkyNode | null>(null);

	const onSaveNode = (exportObj: FlowExportObject) => {
		localStorage.setItem("slinky-flow", JSON.stringify(exportObj));
		message.success("Node saved successfully.");
	};

	const selectNode = (node: GraphNode | SlinkyNode) => {
		const id = node.id;

		if (id === selectedNode.value?.id) {
			resetSelectedNode();
			return;
		}

		console.log(id, selectedNode.value);
		selectedNode.value = node;
		console.log(selectedNode.value);
	};

	const resetSelectedNode = () => {
		selectedNode.value = null;
	};

	onMounted(() => {
		const savedState = localStorage.getItem("slinky-flow");
		if (savedState) {
			const parsedState: FlowExportObject = JSON.parse(savedState);
			nodes.value = parsedState.nodes || [];
			edges.value = parsedState.edges || [];
		}
	});

	return {
		nodes,
		edges,
		selectedNode,
		onSaveNode,
		selectNode,
		resetSelectedNode,
	};
});
