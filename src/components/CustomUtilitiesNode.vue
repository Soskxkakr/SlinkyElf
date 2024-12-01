<script setup lang="ts">
import { useNode } from "@vue-flow/core";
import { ref } from "vue";
import Icon from "./Icon.vue";
import { useSlinkyStore } from "../stores/useSlinkyStore";

const { selectNode } = useSlinkyStore();
const { node } = useNode();
const comment = ref(node.data?.data?.comment || "");
</script>

<template>
	<a-card
		size="small"
		:bordered="false"
		title="Comment"
		@click="selectNode(node)"
		style="border: 1px solid black; min-width: 150px; max-width: 200px"
	>
		<template #extra><Icon name="comment" /></template>
		<a-textarea
			v-show="comment"
			v-model:value="comment"
			placeholder="Description"
			:rows="4"
			style="width: 400px"
		/>
		<a-typography-text
			v-show="node.data?.description"
			type="secondary"
			class="truncate-text"
			>{{ node.data?.description }}</a-typography-text
		>
	</a-card>
</template>
