import { FlowExportObject, Node, useVueFlow } from "@vue-flow/core";
import { ref, watch } from "vue";
import { SlinkyNode } from "../stores/useSlinkyStore";
import { Position } from "@vue-flow/core";

let id = 0;

const savedState = localStorage.getItem("slinky-flow");

if (savedState) {
	const parsedState: FlowExportObject = JSON.parse(savedState);
	id = parsedState.nodes.length;
}

/**
 * @returns {string} - A unique id.
 */
function getId() {
	return `${id++}`;
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
	draggedNode: ref<SlinkyNode | null>(null),
	isDragOver: ref(false),
	isDragging: ref(false),
};

export default function useDragAndDrop() {
	const { draggedNode, isDragOver, isDragging } = state;

	const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } =
		useVueFlow();

	watch(isDragging, (dragging) => {
		document.body.style.userSelect = dragging ? "none" : "";
	});

	function onDragStart(event: DragEvent, node: SlinkyNode) {
		if (event.dataTransfer) {
			event.dataTransfer.setData("application/vueflow", JSON.stringify(node));
			event.dataTransfer.effectAllowed = "move";
		}

		draggedNode.value = node;
		isDragging.value = true;

		document.addEventListener("drop", onDragEnd);
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();

		if (draggedNode.value) {
			isDragOver.value = true;

			if (event.dataTransfer) {
				event.dataTransfer.dropEffect = "move";
			}
		}
	}

	function onDragLeave() {
		isDragOver.value = false;
	}

	function onDragEnd() {
		isDragging.value = false;
		isDragOver.value = false;
		document.removeEventListener("drop", onDragEnd);
	}

	function onDrop(event: DragEvent) {
		const position = screenToFlowCoordinate({
			x: event.clientX,
			y: event.clientY,
		});

		const nodeId = getId();

		console.log(nodeId);

		const newNode: Node = {
			id: nodeId,
			type: draggedNode.value?.type || "trigger",
			position,
			data: draggedNode.value
				? { ...draggedNode.value, toolbarPosition: Position.Top }
				: null,
		};

		const { off } = onNodesInitialized(() => {
			updateNode(nodeId, (node) => ({
				position: {
					x: node.position.x - node.dimensions.width / 2,
					y: node.position.y - node.dimensions.height / 2,
				},
			}));

			off();
		});

		addNodes(newNode);
	}

	return {
		draggedNode,
		isDragOver,
		isDragging,
		onDragStart,
		onDragLeave,
		onDragOver,
		onDrop,
	};
}
