<script setup lang="ts">
import useDragAndDrop from "../stores/useDnDStore";
import NodeCard from "./NodeCard.vue";
import { useSlinkyStore } from "../stores/useSlinkyStore";

const { sideBarNodes, resetSelectedNode } = useSlinkyStore();
const { onDragStart } = useDragAndDrop();

const EVENT_MAP = {
  trigger: "Triggers",
  sendMessage: "Actions",
  addComment: "Utilities",
  dateTimeConnector: "Conditions",
  dateTime: "DateTime",
};
</script>

<template>
  <aside class="scrollable-aside" @click="resetSelectedNode">
    <a-typography-title :level="2">Slinky Elf</a-typography-title>
    <template v-for="event in Object.keys(EVENT_MAP)">
      <a-typography-title :level="5">{{ EVENT_MAP[event] }}</a-typography-title>
      <div
        class="nodes"
        v-for="node in sideBarNodes.filter((sbNode) => sbNode.type === event)"
        :key="node.id"
        :draggable="true"
        @dragstart="onDragStart($event, node)"
      >
        <template v-if="Object.keys(EVENT_MAP).includes(node.type)">
          <NodeCard :node="node" />
        </template>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.scrollable-aside {
  max-height: 100vh; /* Or a specific height, e.g., 400px */
  overflow-y: auto;
  padding: 16px; /* Optional, for better spacing */
  background-color: #f9f9f9; /* Optional, to visually separate the aside */
  border: 1px solid #ddd; /* Optional, to give it a container-like look */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional, for elevation */
}
</style>
