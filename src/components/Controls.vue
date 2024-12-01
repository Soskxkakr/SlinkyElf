<script setup lang="ts">
import { Panel, useVueFlow } from "@vue-flow/core";
import Icon from "./Icon.vue";
import { reactive } from "vue";
import { useSlinkyStore } from "../stores/useSlinkyStore";

const { nodes, addNodes, dimensions, toObject } = useVueFlow();
const { onSaveNode } = useSlinkyStore();
const node = reactive({
	name: "",
	description: "",
	type: "sendMessage",
});

function saveNode() {
	onSaveNode(toObject());
}

function onAdd() {
	if (node.name && node.type && node.description) {
		const id = nodes.value.length + 1;
		addNodes([
			{
				id: `new_node-${id}`,
				label: node.name,
				type: node.type,
				data: {
					description: node.description,
				},
				position: {
					x: Math.random() * dimensions.value.width,
					y: Math.random() * dimensions.value.height,
				},
			},
		]);
		node.name = "";
		node.description = "";
		node.type = "sendMessage";
	}
}
</script>

<template>
	<Panel position="top-right">
		<div class="buttons">
			<button title="save graph" @click="saveNode">
				<Icon name="save" />
			</button>
			<a-popover placement="bottomRight" trigger="click">
				<button title="add random node" @click="onAdd">
					<Icon name="add" />
				</button>
				<template #title>
					<span>Add new node</span>
				</template>
				<template #content>
					<a-space direction="vertical">
						<span>Title</span>
						<a-input
							v-model:value="node.name"
							placeholder="Title"
							class="input-field"
							style="width: 400px"
						/>
						<span>Description</span>
						<a-textarea
							v-model:value="node.description"
							placeholder="Description"
							:rows="4"
							style="width: 400px"
						/>
						<span>Type of node</span>
						<a-radio-group v-model:value="node.type" button-style="solid">
							<a-radio-button value="sendMessage">Send Message</a-radio-button>
							<a-radio-button value="addComment">Add Comments</a-radio-button>
							<a-radio-button value="dateTime">Business Hours</a-radio-button>
						</a-radio-group>
						<a-button type="primary" @click="onAdd">Add</a-button>
					</a-space>
				</template>
			</a-popover>
		</div>
	</Panel>
</template>
