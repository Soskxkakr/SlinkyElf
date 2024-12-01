<script setup lang="ts">
import { SlinkyNode } from "../stores/useSlinkyStore";

const props = defineProps<{
	node: SlinkyNode;
}>();
</script>

<template>
	<a-card
		size="small"
		:bordered="false"
		:title="props.node.name || 'Trigger'"
		style="border: 2px solid black"
	>
		<a-timeline
			v-for="(item, index) in props.node?.data?.payload || []"
			:key="index"
		>
			<a-timeline-item color="green" v-show="item.type === 'text'">{{
				item.text
			}}</a-timeline-item>
			<a-timeline-item color="green" v-show="item.type === 'attachment'"
				><a-image :src="item.attachment" alt="Attachment Image" :width="100"
			/></a-timeline-item>
		</a-timeline>

		<a-typography-text v-if="props.node?.data?.comment"
			>{{ node.data.comment }}
		</a-typography-text>

		<a-typography-text v-if="props.node.type === 'trigger'"
			>Conversation Started
		</a-typography-text>
	</a-card>
</template>
