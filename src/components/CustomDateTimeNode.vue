<script setup lang="ts">
import { Handle, Position, useNode } from "@vue-flow/core";
import Icon from "./Icon.vue";
import { useSlinkyStore } from "../stores/useSlinkyStore";
import { ref } from "vue";
import dayjs, { Dayjs } from "dayjs";

const { selectNode } = useSlinkyStore();
const { node } = useNode();

const timeRanges = ref<Dayjs, Dayjs>(
	node.data?.data?.times?.map((time) => [
		dayjs(time.startTime, "HH:mm"),
		dayjs(time.endTime, "HH:mm"),
	])
);
</script>

<template>
	<a-card
		size="small"
		:bordered="false"
		:title="node?.label || 'Date'"
		@click="selectNode(node)"
		style="border: 1px solid black; min-width: 150px; max-width: 250px"
	>
		<Handle
			type="source"
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
			:position="Position.Bottom"
			:style="{
				height: '16px',
				width: '6px',
				backgroundColor: 'black',
				filter: 'invert(100%)',
			}"
		/>
		<template #extra><Icon name="calendar" /></template>
		<a-typography-text
			v-show="node.data?.description"
			type="secondary"
			class="truncate-text"
			>{{ node.data?.description }}</a-typography-text
		>
		<template v-if="node.data?.data?.times?.length > 0">
			<template v-for="(time, index) in node.data.data.times" :key="index">
				<a-time-range-picker
					:bordered="false"
					:disabled="true"
					v-model:value="timeRanges[index]"
					format="HH:mm"
					style="width: 150px"
				/>
				<span v-show="!!time?.day">{{ time.day }}</span>
			</template>
		</template>
	</a-card>
</template>
