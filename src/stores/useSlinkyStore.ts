import { defineStore } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";
import {
  FlowExportObject,
  GraphNode,
  type Edge,
  type Node,
} from "@vue-flow/core";
import { message } from "ant-design-vue";
import { SlinkyNode, initialNodes } from "../data/nodes";

export const useSlinkyStore = defineStore("slinky-flow", () => {
  const sideBarNodes = ref<SlinkyNode[]>(initialNodes);
  const nodes = ref<Node[]>([]);
  const edges = ref<Edge[]>([]);
  const selectedNode = ref<GraphNode | SlinkyNode | null>(null);

  const onAddNode = (node: SlinkyNode) => {
    sideBarNodes.value.push(node);
    localStorage.setItem(
      "slinky-initial-nodes",
      JSON.stringify(sideBarNodes.value)
    );
  };

  const onSaveNode = (exportObj: FlowExportObject) => {
    localStorage.setItem("slinky-flow", JSON.stringify(exportObj));
    message.success("Node saved successfully.");
  };

  const onUpdateNode = (node: SlinkyNode) => {
    const filteredNodes = sideBarNodes.value.filter(
      (sideBarNode) => sideBarNode.id !== node.id
    );
    filteredNodes.push(node);
    sideBarNodes.value = filteredNodes;
    localStorage.setItem(
      "slinky-initial-nodes",
      JSON.stringify(sideBarNodes.value)
    );
  };

  const selectNode = (node: GraphNode | SlinkyNode) => {
    const id = node.id;

    if (id === selectedNode.value?.id) {
      resetSelectedNode();
      return;
    }

    selectedNode.value = node;
  };

  const resetSelectedNode = () => {
    selectedNode.value = null;
  };

  onBeforeMount(() => {
    const savedInitialNodes = localStorage.getItem("slinky-initial-nodes");

    if (savedInitialNodes) {
      const parsedState: SlinkyNode[] = JSON.parse(savedInitialNodes);
      sideBarNodes.value = parsedState;
    } else {
      localStorage.setItem(
        "slinky-initial-nodes",
        JSON.stringify(initialNodes)
      );
    }
  });

  onMounted(() => {
    const savedState = localStorage.getItem("slinky-flow");
    if (savedState) {
      const parsedState: FlowExportObject = JSON.parse(savedState);
      nodes.value = parsedState.nodes || [];
      edges.value = parsedState.edges || [];
    }
  });

  return {
    sideBarNodes,
    nodes,
    edges,
    selectedNode,
    onAddNode,
    onSaveNode,
    onUpdateNode,
    selectNode,
    resetSelectedNode,
  };
});
